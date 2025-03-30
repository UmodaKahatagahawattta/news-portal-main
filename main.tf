provider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "app_server" {
  ami           = "ami-00bdb8b6b0eb6d2c8"  
  instance_type = "t2.micro"

  tags = {
    Name = "news-portal main"
  }
}
