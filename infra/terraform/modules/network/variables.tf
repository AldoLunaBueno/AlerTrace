variable "env" {}
variable "vpc_cidr" {}
variable "public_subnets" { type = list(string) }
variable "private_subnets" { type = list(string) }
variable "availability_zones" { type = list(string) }