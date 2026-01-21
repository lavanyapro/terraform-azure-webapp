pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building Docker image'
                sh 'docker build -t sevenstones/game .'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application'
            }
        }
    }
}
