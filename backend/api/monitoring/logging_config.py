import logging
import json
import sys
from datetime import datetime
from typing import Any, Dict
from pythonjsonlogger import jsonlogger


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter that adds timestamp and level name"""

    def add_fields(self, log_record: Dict[str, Any], record: logging.LogRecord, message_dict: Dict[str, Any]) -> None:
        """Add custom fields to log record"""
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        log_record['timestamp'] = datetime.utcnow().isoformat()
        log_record['level'] = record.levelname
        log_record['logger'] = record.name
        log_record['module'] = record.module
        log_record['function'] = record.funcName


def setup_logging(app_name: str = "sachatrace", log_level: str = "INFO") -> logging.Logger:
    """
    Setup structured JSON logging
    
    Args:
        app_name: Name of the application
        log_level: Logging level (INFO, DEBUG, WARNING, ERROR, CRITICAL)
    
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(app_name)
    logger.setLevel(getattr(logging, log_level))
    
    # Remove existing handlers
    logger.handlers.clear()
    
    # JSON formatter for file output
    json_formatter = CustomJsonFormatter()
    
    # Console handler (JSON format)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(json_formatter)
    console_handler.setLevel(getattr(logging, log_level))
    logger.addHandler(console_handler)
    
    return logger


# Create default logger
logger = setup_logging()


def log_request(path: str, method: str, status_code: int, duration_ms: float, user_id: str = None):
    """Log HTTP request"""
    logger.info("HTTP Request", extra={
        'path': path,
        'method': method,
        'status_code': status_code,
        'duration_ms': duration_ms,
        'user_id': user_id
    })


def log_database_query(query: str, duration_ms: float, rows_affected: int = 0):
    """Log database query"""
    logger.debug("Database Query", extra={
        'query': query[:200],  # Log first 200 chars
        'duration_ms': duration_ms,
        'rows_affected': rows_affected
    })


def log_error(error: Exception, context: str = None, **extra):
    """Log error with traceback"""
    logger.error(f"Error: {str(error)}", extra={
        'error_type': type(error).__name__,
        'context': context,
        **extra
    }, exc_info=True)


def log_event(event_name: str, **event_data):
    """Log custom event"""
    logger.info(f"Event: {event_name}", extra=event_data)
