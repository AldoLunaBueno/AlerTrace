resource "aws_elasticache_cluster" "this" {
  cluster_id         = "${var.env}-redis"
  engine             = "redis"
  node_type          = var.node_type
  num_cache_nodes    = 1
  port               = 6379
  subnet_group_name  = var.subnet_group_name
  security_group_ids = [var.sg_id]
}
