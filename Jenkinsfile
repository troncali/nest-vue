pipeline {
    agent any

	environment {
		EMAIL_RECIPIENTS = ''
	}

	options {
		skipDefaultCheckout()
	}

    stages {

        stage("Setup") {
            steps {
				// Wipe workspace and start with a fresh, shallow clone
				checkout([
					$class: 'GitSCM',
					branches: scm.branches,
					extensions: [
						[$class: 'WipeWorkspace'],
						[$class: 'CloneOption', noTags: false, shallow: true]
					],
					userRemoteConfigs: [
						// TODO: change to variables in jenkins?
				        [credentialsId: 'jenkins-generated-ssh-key', url: 'git@github.com:troncali/nest-vue.git']
				    ]
				])
				// Install dependencies
                sh "yarn install --immutable --immutable-cache"
            }
        }

        stage("Test: Units") {
            steps { sh "yarn nx run-many --target=test --all" }
			post { success { junit 'builds/junit-*-unit.xml' } }
        }

        stage("Build Code") {
            steps {
                sh "yarn nx run-many --target=build --all"
            }
			post {
				always {
					archiveArtifacts artifacts: 'builds/**/*', excludes: 'builds/out-tsc/**/*', fingerprint: true
				}
			}
        }

		stage("Build Images") {
            steps {
                echo "build docker images..."
            }
			// post {
			// 	always {
			// 		archiveArtifacts artifacts: 'builds/**/*', excludes: 'builds/out-tsc/**/*', fingerprint: true
			// 	}
			// }
        }

		// Cleanup stage?

		stage("Migrate: Local") {
			steps {
				echo "Running migrations..."
			}
		}

		stage("Seed: Local") {
			steps {
				echo "Seeding data..."
			}
		}

		stage("Test: Integration") {
			steps {
				echo "Integration Testing..."
			}
		}

		// Migrate and Seed Staging (copy DB from prod first)

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

            // no agent, so executors are not used up when waiting for approvals
            agent none
            steps {
                // script {
                //     def deploymentDelay = input id: 'Deploy', message: 'Deploy to production?', submitter: 'rkivisto,admin', parameters: [choice(choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'], description: 'Hours to delay deployment?', name: 'deploymentDelay')]
                //     sleep time: deploymentDelay.toInteger(), unit: 'HOURS'
                // } // OR
				input message: 'Approve deployment to production?'
            }
        }

		// Migrate and Seed Production DB

        stage("Deploy: Production") {
            steps {
                echo "Deploying..."
            }
        }
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
pipeline {
    agent any
    tools {
        nodejs 'node-8.1.3'
    }
    stages {
        stage('Build') {
            steps {
                sh 'nodejs --version'
                sh 'npm install'
                sh 'gulp lint'
            }
        }
        stage('Test') {
            steps {
                sh 'nodejs --version'
                sh 'gulp test'
            }
        }
    }
    post {
        always {
            echo 'One way or another, I have finished'
            deleteDir() /* clean up our workspace */
        }
        success {
            echo 'I succeeeded!'
        }
        unstable {
            echo 'I am unstable :/'
        }
        failure {
            echo 'I failed :('
        }
        changed {
            echo 'Things were different before...'
        }
    }
}
