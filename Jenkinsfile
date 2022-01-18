// Create object to store variables used across stages
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

				// Wipe all workspace files and directories
				sh "rm -rf ./{..?*,.[!.]*,*}"

				copyEnvFiles()

				// Set variables used across stages
				withEnv(readFile('.env').replaceAll(/(#.+\n+)|(\s+#.+)/, '').split('\n') as List) {
					script {
						vxnn.dbHost = "${DB_HOST}"
						vxnn.dbName = "${DB_DATABASE_NAME}"
						vxnn.dbPort = "${DB_PORT}"
						vxnn.dbUser = readFile("apps/docker/secrets/DB_USERNAME")
						vxnn.deploymentApprovers = "${JENKINS_DEPLOYMENT_APPROVERS}"
						vxnn.dockerContext = "${DOCKER_REMOTE_CONTEXT}"
						vxnn.emailRecipients = "${JENKINS_EMAIL_RECIPIENTS}"
						vxnn.projectName = "${DOCKER_PROJECT_NAME}"
						vxnn.repoUrl = "${JENKINS_REPO_URL}"
						vxnn.repoCredentialsId = "${JENKINS_REPO_CREDENTIALS_ID}"
						vxnn.sshHostAlias = "${SSH_HOST_ALIAS}"
						vxnn.stagingCredentialsId = "${JENKINS_STAGING_CREDENTIALS_ID}"
						vxnn.stagingDomain = "${STAGING_DOMAIN}"
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

				// Wipe workspace and start with a fresh, shallow clone
				checkout([
					$class: 'GitSCM',
					branches: scm.branches,
					extensions: [
						[$class: 'WipeWorkspace'],
						[$class: 'CloneOption', noTags: false, shallow: true, depth: 2]
					],
					userRemoteConfigs: [ [
				        credentialsId: "${vxnn.repoCredentialsId}",
						url: "${vxnn.repoUrl}"
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
					junit testResults: 'dist/junit-*-unit.xml',
						skipPublishingChecks: true,
						allowEmptyResults: true
				}
			}
        }

		stage("Migrate: Local") {
			steps {
				// Stop and remove local containers if they already exist
				sh "docker context use default"
				sh "docker compose -p ${vxnn.projectName} stop"
				sh "docker compose -p ${vxnn.projectName} rm -f"

				// Pull copy of db from production
				sh "ssh ${vxnn.sshHostAlias} 'docker exec ${vxnn.dbHost} \
					pg_dump -c -d ${vxnn.dbName} -U ${vxnn.dbUser}' | \
					xz -3 > db-backup.sql.xz"

				// Start the local db container
				sh "docker compose -p ${vxnn.projectName} \
					-f docker-compose.yml \
					-f ./apps/docker/docker-compose-dev.yml up -d ${vxnn.dbHost}"

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

		// TODO: sh "yarn nx affected --base=HEAD~1 --target=e2e --skip-nx-cache"
		stage("Test: Integration") {
			steps { sh "yarn nx e2e backend --runner=local" }
			post {
				success {
					junit testResults: 'dist/junit-*-e2e.xml',
						skipPublishingChecks: true,
						allowEmptyResults: true
				}
				always {
					// Stop all local containers
					sh "docker compose -p ${vxnn.projectName} stop"
					sh "docker compose -p ${vxnn.projectName} rm -f"
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
				sh "docker --context ${vxnn.dockerContext} compose \
					-p ${vxnn.projectName} -f docker-compose.yml \
					-f ./apps/docker/docker-compose-prod.yml \
					build nginx db placeholder certbot worker"
				// send images to remote
				// sh "docker save vxnn/nginx vxnn/db vxnn/placeholder vxnn/certbot vxnn/worker | ssh do 'docker load'"
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
				sh "docker --context ${vxnn.dockerContext} compose \
					-p ${vxnn.projectName} -f docker-compose.yml \
					-f ./apps/docker/docker-compose-prod.yml \
					build backend"
			}
		}

		// Migrate and Seed Production DB
		stage("Migrate: Production") {
			steps {
				// Run migrations and seed data only if db is up
				sh(returnStdout: true, script: """
					docker --context ${vxnn.dockerContext} compose \
						-p ${vxnn.projectName} stop migrator
					docker --context ${vxnn.dockerContext} compose \
						-p ${vxnn.projectName} rm -f migrator

					if [ ! "\$(docker --context ${vxnn.dockerContext} ps -a | grep db)" ]; then
						echo "DB container not running.  Skipping migration."
					else
						docker --context ${vxnn.dockerContext} compose \
							-p ${vxnn.projectName} -f docker-compose.yml \
							-f ./apps/docker/docker-compose-prod.yml \
							up -d --force-recreate migrator
					fi
				""".stripIndent())
			}
		}

		// TODO: handle core image deployment
		stage("Deploy: Staging") {
			steps {
				sh "cross-env-shell DEPLOY_COLOR=${vxnn.stagingColor} \
					SSH_HOST_ALIAS=${vxnn.sshHostAlias} \
					DOCKER_PROJECT_NAME=${vxnn.projectName} \
					DOCKER_REMOTE_CONTEXT=${vxnn.dockerContext} \
					yarn deploy:staging"

				// Clear then copy frontend files
				// sh "ssh ${vxnn.sshHostAlias} 'rm -rf /var/lib/docker/volumes/${vxnn.projectName}_frontend-${vxnn.stagingColor}/_data/{..?*,.[!.]*,*}'"
				// sh "scp -r ./dist/frontend/* ${vxnn.sshHostAlias}:/var/lib/docker/volumes/${vxnn.projectName}_frontend-${vxnn.stagingColor}/_data"

				// Stop current backend container if it's running
				// sh "docker --context ${vxnn.dockerContext} stop \
				// 		backend-${vxnn.stagingColor}; \
				// 	docker --context ${vxnn.dockerContext} rm -f \
				// 		backend-${vxnn.stagingColor}"

				// Start backend container
				// sh "docker --context ${vxnn.dockerContext} compose \
				// 	-p ${vxnn.projectName} -f docker-compose.yml \
				// 	-f ./apps/docker/docker-compose-prod.yml \
				// 	-f ./apps/docker/docker-deploy-colors.yml \
				// 	up -d backend-${vxnn.stagingColor}"
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
						submitter: "${vxnn.deploymentApprovers}",
						parameters: [choice(choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
						description: 'Hours to delay deployment?',
						name: 'deploymentDelay')]
                    sleep time: deploymentDelay.toInteger(), unit: 'HOURS'
                }
            }
        }


        stage("Deploy: Production") {
            steps {
				sh "cross-env-shell DEPLOY_COLOR=${vxnn.stagingColor} \
					SSH_HOST_ALIAS=${vxnn.sshHostAlias} \
					DOCKER_PROJECT_NAME=${vxnn.projectName} \
					DOCKER_REMOTE_CONTEXT=${vxnn.dockerContext} \
					yarn deploy:swap"

				// Update nginx upstreams based on deployment color
				// sh "ssh ${vxnn.sshHostAlias} 'rm /var/lib/docker/volumes/${vxnn.projectName}_nginx-confs/_data/upstreams'"
				// sh "docker --context ${vxnn.dockerContext} exec \
				// 	nginx ln -s /etc/nginx/confs/${vxnn.stagingColor}.conf \
				// 	/tmp/confs/upstreams"

				// Set flag to restart nginx; restart worker container to
				// trigger now. (Worker checks flags every 6 hours by default.)
				// sh "ssh ${vxnn.sshHostAlias} 'touch /var/lib/docker/volumes/${vxnn.projectName}_worker-flags/_data/restart_nginx; \
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

class VxnnEnvVars {
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
