pipeline {
    agent any

    environment {
        // Define Docker Hub repository
        DOCKER_IMAGE = 'xyc2025/habit-tracker-app:tagname'
        GITHUB_PAT = credentials('github-habit-tracker')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: "https://$GITHUB_PAT@github.com/xyc-tw/habit-tracker-app.git"
            }
        }

        stage('Pull Latest Code') {
            steps {
                script {
                    // Pull the latest code from GitHub
                    sh 'git pull origin main'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image with the correct tag
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // Push the Docker image to Docker Hub
                    sh 'docker push $DOCKER_IMAGE'
                }                git reset --soft HEAD~1
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Remove any existing containers with the same name
                    sh 'docker rm -f habit-tracker-app || true'

                    // Run the Docker container
                    sh 'docker run -d -p 3000:3000 --name habit-tracker-app $DOCKER_IMAGE'
                }
            }
        }
    }
    post {
        always {
            // Clean up any running containers after the pipeline finishes
            sh 'docker ps -q --filter "name=habit-tracker-app" | xargs -r docker stop | xargs -r docker rm'
        }
    }
}