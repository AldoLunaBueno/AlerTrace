resource "aws_ecs_cluster" "this" {
  name = "${var.env}-api-cluster"
}

# IAM Role que ECS necesita para descargar imágenes de ECR y enviar logs a CloudWatch
resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.env}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Task Definition con el execution_role_arn
resource "aws_ecs_task_definition" "api" {
  family                   = "${var.env}-api-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_task_execution.arn   # 👈 necesario
  task_role_arn      = aws_iam_role.ecs_task_execution.arn   # opcional, si tu contenedor debe acceder a otros recursos AWS

  container_definitions = jsonencode([{
    name      = "api"
    image     = var.image_url
    essential = true
    portMappings = [{
      containerPort = 8000
      hostPort      = 8000
      protocol      = "tcp"
    }]
    environment = var.env_vars
  }])
}

resource "aws_ecs_service" "api" {
  name            = "${var.env}-api-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnets
    security_groups  = [var.sg_id]
    assign_public_ip = true
  }
}
