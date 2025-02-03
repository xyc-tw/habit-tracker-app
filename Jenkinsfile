pipeline {
    agent any

    environment {
        // Define ECR repository URL
        ECR_REPOSITORY_URL = "329599638481.dkr.ecr.eu-central-1.amazonaws.com/habit-tracker"
        DOCKER_IMAGE = "${ECR_REPOSITORY_URL}:${env.BUILD_NUMBER}"
        GITHUB_PAT = credentials('github-habit-tracker')
        AWS_CREDENTIALS = credentials('habit-tracker-app') 

        // Docker Hub repository (commented out)
        // DOCKER_IMAGE_HUB = "xyc2025/habit-tracker-app:${env.BUILD_NUMBER}"
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
                    // sh 'docker build -t $DOCKER_IMAGE_HUB .' // For Docker Hub
                }
            }
        }

        stage('Login to ECR') {
            steps {
                script {
                    // Login to ECR
                    sh '''
                    aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin $ECR_REPOSITORY_URL
                    '''
                }
            }
        }

        stage('Push to ECR') {
            steps {
                script {
                    // Push the Docker image to ECR
                    sh 'docker push $DOCKER_IMAGE'
                }               
            }
        }

        // stage('Push to Docker Hub') {
        //     steps {
        //         script {
        //             // Push the Docker image to Docker Hub
        //             sh 'docker push $DOCKER_IMAGE_HUB'
        //         }               
        //     }
        // }

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
}