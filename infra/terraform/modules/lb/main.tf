resource "aws_lb" "this" {
  name               = "${var.env}-api-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.sg_id]
  subnets            = var.subnets

  tags = {
    Name = "${var.env}-api-alb"
    Env  = var.env
  }
}

resource "aws_lb_target_group" "this" {
  name        = "${var.env}-api-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip" # ECS Fargate necesita "ip"

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-399"
  }

  tags = {
    Name = "${var.env}-api-tg"
    Env  = var.env
  }
}

resource "aws_lb_listener" "this" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}

# DNS record en Route 53
resource "aws_route53_record" "this" {
  zone_id = var.zone_id
  name    = "api.${var.env}.${var.domain_name}" # ej: api.dev.midominio.com
  type    = "A"

  alias {
    name                   = aws_lb.this.dns_name
    zone_id                = aws_lb.this.zone_id
    evaluate_target_health = true
  }
}
