resource "aws_db_instance" "this" {
  identifier          = "${var.env}-postgres"
  engine              = "postgres"
  instance_class      = var.instance_class
  allocated_storage   = 20 # capacidad de almacenamiento mínima: 20 GiB
  db_name             = var.db_name
  username            = var.db_user
  password            = var.db_password
  multi_az            = false
  skip_final_snapshot = true

  vpc_security_group_ids = [var.sg_id]
  db_subnet_group_name   = var.subnet_group_name
}
