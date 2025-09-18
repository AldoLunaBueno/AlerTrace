provider "aws" {
  region = var.region
}

module "network" {
  source             = "../../modules/network"
  env                = "dev"
  vpc_cidr           = "10.3.0.0/16"
  public_subnets     = ["10.3.1.0/24"]
  availability_zones = ["${var.region}a", "${var.region}b"]
  private_subnets    = ["10.3.2.0/24", "10.3.3.0/24"]
}

module "api" {
  source    = "../../modules/api"
  env       = "dev"
  image_url = "${aws_ecr_repository.api.repository_url}:latest"
  subnets   = module.network.public_subnet_ids
  sg_id     = module.network.api_sg_id
  env_vars = [
    # { name = "DB_HOST", value = module.db.db_endpoint },
    # { name = "REDIS_HOST", value = module.cache.cache_endpoint }
  ]
}

resource "aws_db_subnet_group" "db" {
  name       = "${var.env}-db-subnet-group"
  subnet_ids = module.network.private_subnet_ids

  tags = {
    Name = "${var.env}-db-subnet-group"
  }
}

resource "aws_elasticache_subnet_group" "cache" {
  name       = "${var.env}-cache-subnet-group"
  subnet_ids = module.network.private_subnet_ids

  tags = {
    Name = "${var.env}-cache-subnet-group"
  }
}

module "db" {
  source            = "../../modules/db"
  env               = var.env
  instance_class    = "db.t3.micro"
  db_name           = var.db_name
  db_user           = var.db_user
  db_password       = var.db_password
  sg_id             = module.network.api_sg_id
  subnet_group_name = aws_db_subnet_group.db.name
}

module "cache" {
  source            = "../../modules/cache"
  env               = var.env
  node_type         = "cache.t3.micro"
  sg_id             = module.network.api_sg_id
  subnet_group_name = aws_elasticache_subnet_group.cache.name
}


# === API --(imagen docker)--> ECR --> ECS

# Repositorio en ECR para la API
resource "aws_ecr_repository" "api" {
  name = "api-${var.env}"
}

# Login, build y push de la imagen
resource "null_resource" "api_docker" {
  provisioner "local-exec" {
    command = <<EOT
      aws ecr get-login-password --region ${var.region} \
        | docker login --username AWS --password-stdin ${aws_ecr_repository.api.repository_url}

      docker build -t ${aws_ecr_repository.api.repository_url}:latest ../../../../api
      docker push ${aws_ecr_repository.api.repository_url}:latest
EOT
  }

  triggers = {
    # Fuerza reconstrucción al cambiar el Dockerfile
    docker_hash = filemd5("../../../../api/Dockerfile")
  }
}

# Output con URL de la imagen
output "api_image_url" {
  value = "${aws_ecr_repository.api.repository_url}:latest"
}
