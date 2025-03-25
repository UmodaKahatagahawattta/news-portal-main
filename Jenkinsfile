pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'docker', url: 'https://github.com/UmodaKahatagahawattta/news-portal-main.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    bat 'docker build -t news-portal-main .'
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
            cleanWs()
        }
    }
}
