variable "env" {
  description = "Nombre del entorno (dev, staging, prod)"
  type        = string
}

variable "sg_id" {
  description = "Security Group para el ALB"
  type        = string
}

variable "subnets" {
  description = "Subnets públicas para el ALB"
  type        = list(string)
}

variable "vpc_id" {
  description = "ID de la VPC"
  type        = string
}

variable "container_port" {
  description = "Puerto expuesto por los contenedores ECS"
  type        = number
  default     = 8000
}

variable "zone_id" {
  description = "ID de la zona hospedada en Route 53"
  type        = string
}

variable "domain_name" {
  description = "Nombre de dominio base (ej: midominio.com)"
  type        = string
}
