pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building project...'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying project...'
            }
        }
    }
}

// pipeline {
//     agent any

//     environment {
//         // Define Docker Hub credentials and repository
//         DOCKER_IMAGE = 'xyc2025/habit-tracker-app:tagname'
//         DOCKER_CREDENTIALS = 'dockerhub-credentials-id'  // This should be the Jenkins credentials ID
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 // Checkout source code from GitHub
//                 git 'git@github.com:xyc-tw/habit-tracker-app.git'
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     // Build the Docker image with the correct tag
//                     sh 'docker build -t $DOCKER_IMAGE .'
//                 }
//             }
//         }

//         stage('Push to Docker Hub') {
//             steps {
//                 script {
//                     // Login to Docker Hub (credentials must be stored in Jenkins)
//                     docker.withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
//                         sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
//                     }

//                     // Push the Docker image to Docker Hub
//                     sh 'docker push $DOCKER_IMAGE'
//                 }
//             }
//         }

//         stage('Run Docker Container') {
//             steps {
//                 script {
//                     // Remove any existing containers with the same name
//                     sh 'docker rm -f habit-tracker-app || true'

//                     // Run the Docker container
//                     sh 'docker run -d -p 3000:3000 --name habit-tracker-app $DOCKER_IMAGE'
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             // Clean up any running containers after the pipeline finishes
//             sh 'docker ps -q --filter "name=habit-tracker-app" | xargs -r docker stop | xargs -r docker rm'
//         }
//     }
// }

