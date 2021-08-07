pipeline {
    agent any

    stages {

        stage("Pull") {
            steps {
                echo "Pulling..."
                git branch: 'main', url: 'https://github.com/troncali/nest-vue.git'
                sh "yarn install" // --immutable --immutable-cache ?
            }
        }

        stage("Unit Test") {
            steps {
                echo "Pulling..."
            }
        }

        stage("Build") {
            steps {
                echo "Building..."
                sh "yarn b-build"
                sh "yarn f-build"
            }
        }

        stage("E2E Test") {
            steps {
                echo "Testing..."
            }
        }

        stage("Deploy") {
            steps {
                echo "Deploying..."
                sh "yarn b-start"
                sh "yarn f-start"
            }
        }
    }
}
