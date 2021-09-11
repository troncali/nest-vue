pipeline {
    agent any

	environment {
		JENKINS_REPO_URL = 'git@github.com:troncali/nest-vue.git'
		JENKINS_REPO_CREDENTIALS_ID = 'jenkins-generated-ssh-key'
		EMAIL_RECIPIENTS = ''
	}

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
				        credentialsId: "${JENKINS_REPO_CREDENTIALS_ID}",
						url: "${JENKINS_REPO_URL}"
					] ]
				])
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

        stage("Build Code") {
            steps { sh "yarn nx run-many --target=build --all" }
			post {
				success {
					archiveArtifacts artifacts: 'builds/**/*',
						excludes: 'builds/out-tsc/**/*',
						fingerprint: true
				}
			}
        }

		stage("Build Images") {
            steps {
				// Use .env from local project root (where 'yarn jenkins' ran)
                sh "cp ${INIT_CWD}/.env .env"

				// Alt: create .env from a secret file in Jenkins credentials
				// withCredentials([file(credentialsId: 'projectEnvFile', variable: 'projectEnv')]) {
                //     writeFile file: '.env', text: readFile(projectEnv)
                // }

				// build each image that's needed (but limit to only what's needed?)
				sh "docker compose -f docker-compose.yml -f ./src/docker/docker-compose-prod.yml build --no-cache"
			}
        }

		stage("Migrate: Local") {
			steps {
				// Use .env file variables
				withEnv(readFile('.env').replaceAll(/(#.+\n+)|(\s+#.+)/, '').split('\n') as List) {

					// Copy secrets // TODO: update to use swarm secrets
					sh "cp ${INIT_CWD}/src/docker/secrets/* src/docker/secrets"

					// Stop and remove db container if it already exists
					sh "docker compose rm -fs ${DB_HOST}"

					// Pull copy of db from production
					// https://inedo.com/support/kb/1145/accessing-a-postgresql-database-in-a-docker-container
					sh "ssh do 'docker exec ${DB_HOST} \
						pg_dump -d ${DB_DATABASE_NAME} -U keeper' | \
						xz -3 > db-backup.sql.xz"

					// Start the db container
					sh "docker compose -f docker-compose.yml \
						-f ./src/docker/docker-compose-dev.yml up -d ${DB_HOST}"

					// Load production data into local db
					sh "xz -dc db-backup.sql.xz | docker exec -i ${DB_HOST} \
						psql -h localhost -p ${DB_PORT} -d ${DB_DATABASE_NAME} -U keeper \
						--set ON_ERROR_STOP=on --single-transaction"

					sh "cp -f ${INIT_CWD}/docker-compose.yml docker-compose.yml"
					// Run migrations and seed data
					sh "docker compose -f docker-compose.yml \
						-f ./src/docker/docker-compose-dev.yml up migrator"
				}
			}
		}

		stage("Test: Integration") {
			steps {
				echo "Integration Testing..."

				// Start other containers

				// Run tests

				// Stop db
			}
		}

		// Migrate and Seed Production DB
		stage("Migrate: Production") {
			steps {
				echo "Migrating production..."
				// sh "xz -dc db-backup.sql.xz | ssh do 'docker exec -i db psql -d main -U keeper --set ON_ERROR_STOP=on --single-transaction'"
			}
		}

		stage("Deploy: Staging") {
			steps {
				echo "Deploying to development environment"
			}
		}

        stage("Test: E2E") {
            steps {
                echo "E2E Testing..."
            }
        }

		stage('UAT') {
			// when {
			// 	branch 'production'
			// }

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
                echo "Deploying..."
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
