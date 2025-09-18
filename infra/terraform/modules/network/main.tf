resource "aws_vpc" "this" {
  cidr_block = var.vpc_cidr
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnets)
  cidr_block              = var.public_subnets[count.index]
  vpc_id                  = aws_vpc.this.id
  map_public_ip_on_launch = true
}


resource "aws_subnet" "private" {
  count             = length(var.private_subnets)
  availability_zone = var.availability_zones[count.index]
  cidr_block        = var.private_subnets[count.index]
  vpc_id            = aws_vpc.this.id
}

resource "aws_security_group" "api" {
  name        = "${var.env}-api-sg"
  description = "Allow traffic to API"
  vpc_id      = aws_vpc.this.id
}