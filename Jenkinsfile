pipeline {
    agent any

    environment {
        // Define Docker Hub credentials and repository
        DOCKER_IMAGE = 'xyc2025/habit-tracker-app:tagname'
        DOCKER_CREDENTIALS = credentials('dockerhub-habit-tracker')
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
                withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        // Debug output for Docker credentials
                        echo "Docker Username: $DOCKER_USERNAME"  // Debug output
                        echo "Docker Password: $DOCKER_PASSWORD"  // Debug output
                        
                        // Login to Docker Hub
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                        
                        // Push the Docker image to Docker Hub
                        sh 'docker push $DOCKER_IMAGE'
                    }
                }
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