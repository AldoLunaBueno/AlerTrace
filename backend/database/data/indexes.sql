-- Índices para empresas y trabajadores
CREATE INDEX idx_empresas_ruc ON empresas(ruc);
CREATE INDEX idx_empresas_email ON empresas(email);
CREATE INDEX idx_empresas_estado ON empresas(estado);
CREATE INDEX idx_empresas_smart_account ON empresas(smart_account_address);
CREATE INDEX idx_empresas_blockchain_active ON empresas(blockchain_active);
CREATE INDEX idx_trabajadores_dni ON trabajadores(dni);
CREATE INDEX idx_trabajadores_email ON trabajadores(email);
CREATE INDEX idx_trabajadores_empresa ON trabajadores(id_empresa);
CREATE INDEX idx_trabajadores_rol ON trabajadores(rol);
CREATE INDEX idx_trabajadores_activo ON trabajadores(activo);
CREATE INDEX idx_trabajadores_smart_account ON trabajadores(smart_account_address);

-- Índices para sensores y lecturas (optimizados para alto volumen)
CREATE INDEX idx_sensores_empresa ON sensores(id_empresa);
CREATE INDEX idx_sensores_device_id ON sensores(device_id);
CREATE INDEX idx_sensores_tipo ON sensores(tipo_sensor);
CREATE INDEX idx_sensores_estado ON sensores(estado);
CREATE INDEX idx_asignaciones_sensor ON asignaciones_sensores(id_sensor);
CREATE INDEX idx_asignaciones_trabajador ON asignaciones_sensores(id_trabajador);
CREATE INDEX idx_asignaciones_fecha ON asignaciones_sensores(fecha_asignacion);
CREATE INDEX idx_lecturas_sensor_timestamp ON lecturas_sensores(id_sensor, timestamp DESC);
CREATE INDEX idx_lecturas_timestamp ON lecturas_sensores(timestamp DESC);
CREATE INDEX idx_lecturas_temperatura ON lecturas_sensores(temperatura) WHERE temperatura IS NOT NULL;
CREATE INDEX idx_lecturas_humedad ON lecturas_sensores(humedad) WHERE humedad IS NOT NULL;
CREATE INDEX idx_lecturas_ph ON lecturas_sensores(ph) WHERE ph IS NOT NULL;
CREATE INDEX idx_alertas_sensor ON alertas(id_sensor);
CREATE INDEX idx_alertas_estado ON alertas(estado);
CREATE INDEX idx_alertas_severidad ON alertas(severidad);
CREATE INDEX idx_alertas_fecha_creacion ON alertas(fecha_creacion DESC);
CREATE INDEX idx_umbrales_sensor ON configuracion_umbrales(id_sensor);
CREATE INDEX idx_umbrales_parametro ON configuracion_umbrales(parametro);
CREATE INDEX idx_umbrales_activo ON configuracion_umbrales(activo);

-- Índices para granjas y certificaciones
CREATE INDEX idx_farms_empresa ON farms(id_empresa);
CREATE INDEX idx_farms_geohash ON farms(geohash);
CREATE INDEX idx_farms_location ON farms(latitude, longitude);
CREATE INDEX idx_farms_created ON farms(created_at DESC);
CREATE INDEX idx_certifications_farm ON farm_certifications(id_farm);
CREATE INDEX idx_certifications_type ON farm_certifications(certification_type);
CREATE INDEX idx_certifications_expiry ON farm_certifications(expiry_date);
CREATE INDEX idx_certifications_valid ON farm_certifications(is_valid);
CREATE INDEX idx_certifications_number ON farm_certifications(certification_number);

-- Índices para lotes y trazabilidad
CREATE INDEX idx_lots_empresa ON lots(id_empresa);
CREATE INDEX idx_lots_farm ON lots(id_farm);
CREATE INDEX idx_lots_code ON lots(lot_code);
CREATE INDEX idx_lots_state ON lots(state);
CREATE INDEX idx_lots_owner ON lots(current_owner_id);
CREATE INDEX idx_lots_harvest_date ON lots(harvest_date DESC);
CREATE INDEX idx_lots_tx_hash ON lots(blockchain_tx_hash) WHERE blockchain_tx_hash IS NOT NULL;

-- Índices para eventos de cosecha, procesamiento y transferencia
CREATE INDEX idx_harvest_lot ON harvest_events(id_lot);
CREATE INDEX idx_harvest_harvester ON harvest_events(harvester_id);
CREATE INDEX idx_harvest_date ON harvest_events(harvest_date DESC);
CREATE INDEX idx_harvest_created ON harvest_events(created_at DESC);
CREATE INDEX idx_harvest_tx_hash ON harvest_events(blockchain_tx_hash) WHERE blockchain_tx_hash IS NOT NULL;
CREATE INDEX idx_processing_lot ON processing_events(id_lot);
CREATE INDEX idx_processing_processor ON processing_events(processor_id);
CREATE INDEX idx_processing_date ON processing_events(processing_date DESC);
CREATE INDEX idx_processing_type ON processing_events(processing_type);
CREATE INDEX idx_processing_created ON processing_events(created_at DESC);
CREATE INDEX idx_processing_tx_hash ON processing_events(blockchain_tx_hash) WHERE blockchain_tx_hash IS NOT NULL;
CREATE INDEX idx_transfer_lot ON transfer_events(id_lot);
CREATE INDEX idx_transfer_from ON transfer_events(from_actor_id);
CREATE INDEX idx_transfer_to ON transfer_events(to_actor_id);
CREATE INDEX idx_transfer_date ON transfer_events(transfer_date DESC);
CREATE INDEX idx_transfer_created ON transfer_events(created_at DESC);
CREATE INDEX idx_transfer_tx_hash ON transfer_events(blockchain_tx_hash) WHERE blockchain_tx_hash IS NOT NULL;

-- Índices para sincronización blockchain
CREATE INDEX idx_sync_entity ON blockchain_sync(entity_type, entity_id);
CREATE INDEX idx_sync_tx_hash ON blockchain_sync(transaction_hash);
CREATE INDEX idx_sync_status ON blockchain_sync(sync_status);
CREATE INDEX idx_sync_pending ON blockchain_sync(sync_status, created_at) WHERE sync_status = 'pending';
CREATE INDEX idx_sync_failed ON blockchain_sync(sync_status, attempts) WHERE sync_status = 'failed';
CREATE INDEX idx_sync_block ON blockchain_sync(block_number) WHERE block_number IS NOT NULL;
CREATE INDEX idx_sync_created ON blockchain_sync(created_at DESC);
CREATE INDEX idx_sync_last_attempt ON blockchain_sync(last_attempt_at DESC) WHERE last_attempt_at IS NOT NULL;
