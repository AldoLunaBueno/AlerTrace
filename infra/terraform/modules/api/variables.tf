variable "env" {}
variable "image_url" {}
variable "subnets" { type = list(string) }
variable "sg_id" {}
variable "env_vars" { type = list(object({
  name  = string
  value = string
})) }
