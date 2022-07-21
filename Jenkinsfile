// Create object to store variables used across stages
def nestVue = new NestVueEnvVars();

pipeline {
    agent any

	options {
		skipDefaultCheckout()
	}

    stages {

        stage("Setup") {
            steps {
				sh "node --version; docker version"

				// Wipe all workspace files and directories
				sh "rm -rf ./{..?*,.[!.]*,*}"

				copyEnvFiles()

				// Set variables used across stages
				withEnv(readFile('.env').replaceAll(/(#.+\n+)|(\s+#.+)/, '').split('\n') as List) {
					script {
						nestVue.dbHost = "${DB_HOST}"
						nestVue.dbName = "${DB_DATABASE_NAME}"
						nestVue.dbPort = "${DB_PORT}"
						nestVue.dbUser = readFile("apps/docker/secrets/DB_USERNAME")
						nestVue.deploymentApprovers = "${JENKINS_DEPLOYMENT_APPROVERS}"
						nestVue.dockerContext = "${DOCKER_REMOTE_CONTEXT}"
						nestVue.emailRecipients = "${JENKINS_EMAIL_RECIPIENTS}"
						nestVue.projectName = "${DOCKER_PROJECT_NAME}"
						nestVue.repoUrl = "${JENKINS_REPO_URL}"
						nestVue.repoCredentialsId = "${JENKINS_REPO_CREDENTIALS_ID}"
						nestVue.sshHostAlias = "${SSH_HOST_ALIAS}"
						nestVue.stagingCredentialsId = "${JENKINS_STAGING_CREDENTIALS_ID}"
						nestVue.stagingDomain = "${STAGING_DOMAIN}"
					}
				}

				// Determine current staging target
				withCredentials([
					usernameColonPassword(
						credentialsId: "${nestVue.stagingCredentialsId}",
						variable: 'credentials'
					)
				]) {
					script {
						nestVue.stagingColor = sh(
							script: 'curl -s -u $credentials ' +
								"https://${nestVue.stagingDomain}/id",
							returnStdout: true
						).trim()
					}
				}
				echo "deploymentId: ${nestVue.stagingColor}"

				// Wipe workspace and start with a fresh, shallow clone
				checkout([
					$class: 'GitSCM',
					branches: scm.branches,
					extensions: [
						[$class: 'WipeWorkspace'],
						[$class: 'CloneOption', noTags: false, shallow: true, depth: 2]
					],
					userRemoteConfigs: [ [
				        credentialsId: "${nestVue.repoCredentialsId}",
						url: "${nestVue.repoUrl}"
					] ]
				])

				copyEnvFiles()

				// Install dependencies; fail if yarn.lock would change
                sh "yarn install --immutable"
            }
        }

		// TODO: Use nx caching: https://nx.dev/l/r/ci/monorepo-ci-jenkins
		// sh "yarn nx affected --base=HEAD~1 --target=test --skip-nx-cache"
        stage("Test: Units") {
            steps { sh "yarn nx run-many --target=test --runner=local --all" }
			post {
				success {
					junit testResults: 'dist/tests/junit-*-unit.xml',
						skipPublishingChecks: true,
						allowEmptyResults: true
				}
			}
        }

		stage("Migrate: Local") {
			steps {
				// Stop and remove local containers if they already exist
				sh "docker context use default"
				sh "docker compose -p ${nestVue.projectName} stop"
				sh "docker compose -p ${nestVue.projectName} rm -f"

				// Pull copy of db from production
				sh "ssh ${nestVue.sshHostAlias} 'docker exec ${nestVue.dbHost} \
					pg_dump -c -d ${nestVue.dbName} -U ${nestVue.dbUser}' | \
					xz -3 > db-backup.sql.xz"

				// Start the local db container
				sh "docker compose -p ${nestVue.projectName} \
					-f docker-compose.yml \
					-f ./apps/docker/docker-compose-dev.yml up -d ${nestVue.dbHost}"

				// Test if db is ready for connections
				timeout(5) {
					waitUntil {
						script {
							def r = sh(
								script: "docker exec -i ${nestVue.dbHost} \
									pg_isready -h localhost -p ${nestVue.dbPort} \
									-d ${nestVue.dbName} -U ${nestVue.dbUser}",
								returnStatus: true
							)
							return (r == 0);
						}
					}
				}

				// Load production data into local db
				sh "xz -dc db-backup.sql.xz | docker exec -i ${nestVue.dbHost} \
					psql -h localhost -p ${nestVue.dbPort} -d ${nestVue.dbName} \
					-U ${nestVue.dbUser} --set ON_ERROR_STOP=on \
					--single-transaction"

				// Run migrations and seed data
				sh "yarn migration:run; yarn seed"
			}
		}

		// TODO: sh "yarn nx affected --base=HEAD~1 --target=e2e --skip-nx-cache"
		stage("Test: Integration") {
			steps { sh "yarn nx e2e backend --runner=local" }
			post {
				success {
					junit testResults: 'dist/tests/junit-*-e2e.xml',
						skipPublishingChecks: true,
						allowEmptyResults: true
				}
				always {
					// Stop all local containers
					sh "docker compose -p ${nestVue.projectName} stop"
					sh "docker compose -p ${nestVue.projectName} rm -f"
				}
			}
		}

		// TODO: sh "yarn nx affected --target=build --prod"
		stage("Build Code") {
            steps { sh "yarn nx run-many --target=build --all --prod --runner=local" }
			post {
				success {
					archiveArtifacts artifacts: 'dist/**/*',
						excludes: 'dist/out-tsc/**/*',
						fingerprint: true
				}
			}
        }

		stage("Build Images: Core") {
			when { branch 'core' }
			steps {
				sh "docker --context ${nestVue.dockerContext} compose \
					-p ${nestVue.projectName} -f docker-compose.yml \
					-f ./apps/docker/docker-compose-prod.yml \
					build nginx db placeholder certbot worker"
				// send images to remote
				// sh "docker save nest-vue/nginx nest-vue/db nest-vue/placeholder nest-vue/certbot nest-vue/worker | ssh do 'docker load'"
				// send images to remote v2
				// sh(returnStdout: true, script: """
				// 	for img in $(docker-compose config | awk '{if ($1 == "image:") print $2;}'); do
				// 		images="$images $img"
				// 	done
				// 	docker save $images | ssh do 'docker load'
				// 	echo "$images saved to host"
				// """.stripIndent())
			}
        }

		stage("Build Images: Services") {
			// when { not { branch 'core' } }
			steps {
				sh "docker --context ${nestVue.dockerContext} compose \
					-p ${nestVue.projectName} -f docker-compose.yml \
					-f ./apps/docker/docker-compose-prod.yml \
					build backend"
			}
		}

		// Migrate and Seed Production DB
		stage("Migrate: Production") {
			steps {
				// Run migrations and seed data only if db is up
				sh(returnStdout: true, script: """
					docker --context ${nestVue.dockerContext} compose \
						-p ${nestVue.projectName} stop migrator
					docker --context ${nestVue.dockerContext} compose \
						-p ${nestVue.projectName} rm -f migrator

					if [ ! "\$(docker --context ${nestVue.dockerContext} ps -a | grep db)" ]; then
						echo "DB container not running.  Skipping migration."
					else
						docker --context ${nestVue.dockerContext} compose \
							-p ${nestVue.projectName} -f docker-compose.yml \
							-f ./apps/docker/docker-compose-prod.yml \
							up -d --force-recreate migrator
					fi
				""".stripIndent())
			}
		}

		// TODO: handle core image deployment
		stage("Deploy: Staging") {
			steps {
				sh "cross-env-shell DEPLOY_COLOR=${nestVue.stagingColor} \
					SSH_HOST_ALIAS=${nestVue.sshHostAlias} \
					DOCKER_PROJECT_NAME=${nestVue.projectName} \
					DOCKER_REMOTE_CONTEXT=${nestVue.dockerContext} \
					yarn deploy:staging"

				// Clear then copy frontend files
				// sh "ssh ${nestVue.sshHostAlias} 'rm -rf /var/lib/docker/volumes/${nestVue.projectName}_frontend-${nestVue.stagingColor}/_data/{..?*,.[!.]*,*}'"
				// sh "scp -r ./dist/frontend/* ${nestVue.sshHostAlias}:/var/lib/docker/volumes/${nestVue.projectName}_frontend-${nestVue.stagingColor}/_data"

				// Stop current backend container if it's running
				// sh "docker --context ${nestVue.dockerContext} stop \
				// 		backend-${nestVue.stagingColor}; \
				// 	docker --context ${nestVue.dockerContext} rm -f \
				// 		backend-${nestVue.stagingColor}"

				// Start backend container
				// sh "docker --context ${nestVue.dockerContext} compose \
				// 	-p ${nestVue.projectName} -f docker-compose.yml \
				// 	-f ./apps/docker/docker-compose-prod.yml \
				// 	-f ./apps/docker/docker-deploy-colors.yml \
				// 	up -d backend-${nestVue.stagingColor}"
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
                script {
                    def deploymentDelay = input id: 'Deploy',
						message: 'Approve deployment to production?',
						submitter: "${nestVue.deploymentApprovers}",
						parameters: [choice(choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
						description: 'Hours to delay deployment?',
						name: 'deploymentDelay')]
                    sleep time: deploymentDelay.toInteger(), unit: 'HOURS'
                }
            }
        }


        stage("Deploy: Production") {
            steps {
				sh "cross-env-shell DEPLOY_COLOR=${nestVue.stagingColor} \
					SSH_HOST_ALIAS=${nestVue.sshHostAlias} \
					DOCKER_PROJECT_NAME=${nestVue.projectName} \
					DOCKER_REMOTE_CONTEXT=${nestVue.dockerContext} \
					yarn deploy:swap"

				// Update nginx upstreams based on deployment color
				// sh "ssh ${nestVue.sshHostAlias} 'rm /var/lib/docker/volumes/${nestVue.projectName}_nginx-confs/_data/upstreams'"
				// sh "docker --context ${nestVue.dockerContext} exec \
				// 	nginx ln -s /etc/nginx/confs/${nestVue.stagingColor}.conf \
				// 	/tmp/confs/upstreams"

				// Set flag to restart nginx; restart worker container to
				// trigger now. (Worker checks flags every 6 hours by default.)
				// sh "ssh ${nestVue.sshHostAlias} 'touch /var/lib/docker/volumes/${nestVue.projectName}_worker-flags/_data/restart_nginx; \
				// 	docker restart worker'"
            }
        }

		stage("Cleanup") {
			steps {
				// Rebase and commit new version to repo

				// Cleanup: remove .env/secrets, stop and prune containers on remote, archive?
				sh "rm -rf ./.env ./apps/docker/secrets/*"
			}
		}

    }
}

class NestVueEnvVars {
	// Variables set dynamically through pipeline script based on .env vars
	def dbHost
	def dbName
	def dbPort
	def dbUser
	def deploymentApprovers
	def dockerContext
	def emailRecipients
	def projectName
	def repoUrl
	def repoCredentialsId
	def sshHostAlias
	def stagingColor
	def stagingCredentialsId
	def stagingDomain
}

def copyEnvFiles() {
	// Use secrets from project root (where 'yarn jenkins' invoked)
	sh "mkdir -p ./apps/docker/secrets && \
		cp ${INIT_CWD}/apps/docker/secrets/* apps/docker/secrets"

	// Use .env from project root (where 'yarn jenkins' invoked)
	sh "cp ${INIT_CWD}/.env .env"

	// OR create .env from a secret file in Jenkins credentials
	// withCredentials([file(credentialsId: 'projectEnvFile', variable: 'projectEnv')]) {
	//     writeFile file: '.env', text: readFile(projectEnv)
	// }
}
