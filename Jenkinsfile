pipeline {
    agent any

    environment {
        // Define Docker Hub credentials and repository
        DOCKER_IMAGE = 'xyc2025/habit-tracker-app:tagname'
        DOCKER_CREDENTIALS = 'admin'  // This should be the Jenkins credentials ID
        GITHUB_CREDS = 'github-habit-tracker'   // Jenkins credentials ID for GitHub
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Checkout code using GitHub credentials
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            url: 'git@github.com:xyc-tw/habit-tracker-app.git',
                            credentialsId: GITHUB_CREDS  // Use the GitHub credentials ID
                        ]]
                    ])
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Example for pushing Docker image (using DockerHub credentials)
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                    }
                    // Docker build and push code here
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub (credentials must be stored in Jenkins)
                    docker.withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }

                    // Push the Docker image to Docker Hub
                    sh 'docker push $DOCKER_IMAGE'
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

