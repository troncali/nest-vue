// Create object to store variables used across stages
class VxnnEnvVars {
	def emailRecipients = ''
	def projectName = 'vxnn'
	def repoUrl = 'git@github.com:troncali/nest-vue.git'
	def repoCredentialsId = 'jenkins-generated-ssh-key'
	def stagingCredentialsId = 'staging-credentials'

	// Variables set dynamically in scripts
	def dbHost
	def dbName
	def dbPort
	def dbUser
	def stagingColor
	def stagingDomain
}
def vxnn = new VxnnEnvVars();

pipeline {
    agent any

	options {
		skipDefaultCheckout()
	}

    stages {

        stage("Setup") {
            steps {
				sh "node --version; docker version"

				// Wipe workspace and start with a fresh, shallow clone
				checkout([
					$class: 'GitSCM',
					branches: scm.branches,
					extensions: [
						[$class: 'WipeWorkspace'],
						[$class: 'CloneOption', noTags: false, shallow: true]
					],
					userRemoteConfigs: [ [
				        credentialsId: "${vxnn.repoCredentialsId}",
						url: "${vxnn.repoUrl}"
					] ]
				])

				// Use secrets from project root (where 'yarn jenkins' invoked)
				sh "cp ${INIT_CWD}/src/docker/secrets/* src/docker/secrets"

				// Use .env from project root (where 'yarn jenkins' invoked)
                sh "cp ${INIT_CWD}/.env .env"
				// OR create .env from a secret file in Jenkins credentials
				// withCredentials([file(credentialsId: 'projectEnvFile', variable: 'projectEnv')]) {
                //     writeFile file: '.env', text: readFile(projectEnv)
                // }

				// Set variables used across stages
				withEnv(readFile('.env').replaceAll(/(#.+\n+)|(\s+#.+)/, '').split('\n') as List) {					
					script {
						vxnn.dbHost = "${DB_HOST}"
						vxnn.dbName = "${DB_DATABASE_NAME}"
						vxnn.dbPort = "${DB_PORT}"
						vxnn.dbUser = readFile("src/docker/secrets/DB_USERNAME")
						vxnn.stagingDomain = "${STAGING_SUBDOMAIN}.${APP_DOMAIN}"
					}
				}

				// Determine current staging target
				withCredentials([
					usernameColonPassword(
						credentialsId: "${vxnn.stagingCredentialsId}",
						variable: 'credentials'
					)
				]) {
					script {
						vxnn.stagingColor = sh(
							script: 'curl -s -u $credentials ' + 
								"https://${vxnn.stagingDomain}/id",
							returnStdout: true
						).trim()
					}
				}
				echo "deploymentId: ${vxnn.stagingColor}"

				// Install dependencies; fail if yarn.lock would change
                sh "yarn install --immutable"
            }
        }

        stage("Test: Units") {
            steps { sh "yarn nx run-many --target=test --all" }
			post {
				success {
					junit testResults: 'builds/junit-*-unit.xml',
						skipPublishingChecks: true
				}
			}
        }

		stage("Migrate: Local") {
			steps {
				// Stop and remove containers if they already exist
				sh "docker compose -p ${vxnn.projectName} rm -fs"

				// Pull copy of db from production
				// https://inedo.com/support/kb/1145/accessing-a-postgresql-database-in-a-docker-container
				sh "ssh do 'docker exec ${vxnn.dbHost} \
					pg_dump -c -d ${vxnn.dbName} -U ${vxnn.dbUser}' | \
					xz -3 > db-backup.sql.xz"

				// Start the db container
				sh "docker compose -p ${vxnn.projectName} \
					-f docker-compose.yml \
					-f ./src/docker/docker-compose-dev.yml up -d ${vxnn.dbHost}"

				// Test if db is ready for connections
				timeout(5) {
					waitUntil {
						script {
							def r = sh(
								script: "docker exec -i ${vxnn.dbHost} \
									pg_isready -h localhost -p ${vxnn.dbPort} \
									-d ${vxnn.dbName} -U ${vxnn.dbUser}",
								returnStatus: true
							)
							return (r == 0);
						}
					}
				}

				// Load production data into local db
				sh "xz -dc db-backup.sql.xz | docker exec -i ${vxnn.dbHost} \
					psql -h localhost -p ${vxnn.dbPort} -d ${vxnn.dbName} \
					-U ${vxnn.dbUser} --set ON_ERROR_STOP=on \
					--single-transaction"

				// Run migrations and seed data
				sh "yarn migration:run; yarn seed"
			}
		}

		stage("Test: Integration") {
			steps {
				// Run tests // TODO: Update integration test structure
				sh "NODE_ENV=testing yarn nx e2e backend"
			}
			post {
				success {
					junit testResults: 'builds/junit-*-e2e.xml',
						skipPublishingChecks: true
				}
				always {
					// Stop all local containers
					sh "docker compose -p ${vxnn.projectName} rm -fs"
				}
			}
		}

		stage("Build Code") {
            steps { sh "yarn nx run-many --target=build --all --prod" }
			post {
				success {
					archiveArtifacts artifacts: 'builds/**/*',
						excludes: 'builds/out-tsc/**/*',
						fingerprint: true
				}
			}
        }

		stage("Build Images: Core") {
			when { branch 'core' }
			steps {
				sh "docker compose -p ${vxnn.projectName} \
					-f docker-compose.yml \
					-f ./src/docker/docker-compose-prod.yml \
					build nginx db placeholder certbot worker --no-cache"
				// send images to remote
				// sh "docker save nginx db placeholder certbot worker | ssh do 'docker load'"
			}
        }

		stage("Build Images: Services") {
			when { not { branch 'core' } }
			steps {
				sh "docker compose -p ${vxnn.projectName} \
					-f docker-compose.yml \
					-f ./src/docker/docker-compose-prod.yml \
					build backend --no-cache"
				// send images to remote
				// sh "docker save backend | ssh do 'docker load'"
			}
		}

		// Migrate and Seed Production DB
		stage("Migrate: Production") {
			steps {
				// Run migrations and seed data only if db is up
				sh(returnStdout: true, script: """
					if [ ! "$(docker --context DO ps -a | grep db)" ]; then
						echo "DB container not running.  Skipping migration."
					else
						docker --context DO compose -p ${vxnn.projectName} \
							rm -f migrator; \
						docker --context DO compose -p ${vxnn.projectName} \
							-f docker-compose.yml \
							-f ./src/docker/docker-compose-prod.yml \
							up -d migrator
					fi
				""".stripIndent())
			}
		}

		stage("Deploy: Staging") {
			steps {					
				// Clear then copy frontend files
				sh "ssh do 'rm -rf /var/lib/docker/volumes/${vxnn.projectName}_frontend-${vxnn.stagingColor}/_data/{..?*,.[!.]*,*}'"
				sh "scp -r ./builds/frontend/* do:/var/lib/docker/volumes/${vxnn.projectName}_frontend-${vxnn.stagingColor}/_data"

				// Stop current backend container if it's running
				sh "docker --context DO rm -f backend-${vxnn.stagingColor}"

				// Start backend container
				sh "docker --context DO compose -p ${vxnn.projectName} \
					-f docker-compose.yml \
					-f ./src/docker/docker-compose-prod.yml \
					-f ./src/docker/docker-deploy-colors.yml \
					up -d backend-${vxnn.stagingColor}"
			}
		}

        stage("Test: E2E") {
            steps {
                echo "E2E Testing..."
            }
        }

		stage('UAT') {
            // No agent, so executors are not blocked when waiting for approvals
            agent none
            steps {
                // script {
                //     def deploymentDelay = input id: 'Deploy', message: 'Deploy to production?', submitter: 'rkivisto,admin', parameters: [choice(choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'], description: 'Hours to delay deployment?', name: 'deploymentDelay')]
                //     sleep time: deploymentDelay.toInteger(), unit: 'HOURS'
                // } // OR
				input message: 'Approve deployment to production?'
            }
        }


        stage("Deploy: Production") {
            steps {
				// remove existing color flag
				// sh(returnStdout: true, script: '''
				// 	ssh do 'if [ $STAGING_COLOR = "blue" ]; then
				// 		rm /var/lib/docker/volumes/nest-vue_worker-flags/_data/blue
				// 	else
				// 		rm /var/lib/docker/volumes/nest-vue_worker-flags/_data/green
				// 	fi'
				// '''.stripIndent())

				// remove existing color flag
				sh "ssh do 'rm /var/lib/docker/volumes/${vxnn.projectName}_nginx-confs/_data/upstreams'"
				sh "docker --context DO exec nginx ln -s \
					/etc/nginx/confs/${vxnn.stagingColor}.conf \
					/tmp/confs/upstreams"

				// set flags for nginx deployment color and restart
				// sh "ssh do 'touch /var/lib/docker/volumes/nest-vue_worker-flags/_data/${STAGING_COLOR}; \
				sh "ssh do 'touch /var/lib/docker/volumes/${vxnn.projectName}_worker-flags/_data/restart_nginx; \
					docker restart worker'"
            }
        }

		// Rebase and commit new version to repo

		// Cleanup: remove .env, stop and prune containers on remote, archive?
    }
}

// https://github.com/jenkinsci/pipeline-examples/tree/master/pipeline-examples


// https://github.com/kitconcept/jenkins-pipeline-examples
// emailext (
//   to: 'info@kitconcept.com',
//   subject: "${env.JOB_NAME} #${env.BUILD_NUMBER} [${currentBuild.result}]",
//   body: "Build URL: ${env.BUILD_URL}.\n\n",
//   attachLog: true,
// )

// emailext (
//   subject: "FAILURE: #${env.BUILD_NUMBER} ${env.JOB_NAME}",
//   body: "Hey, it seems one of your recent commits broke the build, please check ${env.BUILD_URL}.",
//   attachLog: true,
//   recipientProviders: [[$class: 'RequesterRecipientProvider'], [$class:'CulpritsRecipientProvider']]
// )



// https://github.com/silveimar/jenkins-pipeline-example/blob/master/Jenkinsfile
// pipeline {
//     agent any
//     tools {
//         nodejs 'node-8.1.3'
//     }
//     post {
//         always {
//             echo 'One way or another, I have finished'
//             deleteDir() /* clean up our workspace */
//         }
//         success {
//             echo 'I succeeeded!'
//         }
//         unstable {
//             echo 'I am unstable :/'
//         }
//         failure {
//             echo 'I failed :('
//         }
//         changed {
//             echo 'Things were different before...'
//         }
//     }
// }
