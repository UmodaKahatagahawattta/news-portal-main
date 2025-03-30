pipeline {
    agent any

    environment {
        IMAGE_NAME = "news-portal-main"
        IMAGE_TAG = "latest"
        DOCKERHUB_USER = "umoda"
        TERRAFORM_DIR = '.' 
        AWS_REGION = 'ap-south-1'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'docker', url: 'https://github.com/UmodaKahatagahawattta/news-portal-main.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat "docker build -t %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG% ."
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker_hub_credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        bat "echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin"
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    bat "docker push %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG%"
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                script {
                    
                    dir("$TERRAFORM_DIR") {
                        
                        bat 'terraform init'

                        
                        bat 'terraform apply -auto-approve'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Skipping deploy due to earlier failure(s)'
            }
        }
    }

    post {
        always {
            bat "docker logout"
            cleanWs()
        }
    }
}

