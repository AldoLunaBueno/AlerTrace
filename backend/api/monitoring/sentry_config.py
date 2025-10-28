import os
from typing import Optional, Dict, Any


class SentryConfig:
    """Sentry configuration"""
    
    def __init__(self):
        self.dsn = os.getenv('SENTRY_DSN', '')
        self.environment = os.getenv('ENVIRONMENT', 'development')
        self.traces_sample_rate = float(os.getenv('SENTRY_TRACES_SAMPLE_RATE', '0.1'))
        self.profiles_sample_rate = float(os.getenv('SENTRY_PROFILES_SAMPLE_RATE', '0.1'))
        self.enabled = bool(self.dsn)


def setup_sentry():
    """
    Setup Sentry integration

    """
    config = SentryConfig()
    
    if not config.enabled:
        return None
    
    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
        from sentry_sdk.integrations.logging import LoggingIntegration
        
        sentry_sdk.init(
            dsn=config.dsn,
            environment=config.environment,
            traces_sample_rate=config.traces_sample_rate,
            profiles_sample_rate=config.profiles_sample_rate,
            integrations=[
                FastApiIntegration(),
                SqlalchemyIntegration(),
                LoggingIntegration(
                    level=20,          # Capture info and above
                    event_level=40     # Report errors and above
                ),
            ],
            release=os.getenv('APP_VERSION', '1.0.0'),
            include_local_variables=True,
            send_default_pii=False,
        )
        
        return sentry_sdk
    
    except ImportError:
        print("Warning: sentry-sdk not installed. Error tracking disabled.")
        return None


def capture_exception(exception: Exception, context: Dict[str, Any] = None):
    """
    Capture exception to Sentry
    
    Args:
        exception: The exception to capture
        context: Additional context data
    """
    try:
        import sentry_sdk
        
        if context:
            with sentry_sdk.push_scope() as scope:
                for key, value in context.items():
                    scope.set_context(key, {"data": value})
                sentry_sdk.capture_exception(exception)
        else:
            sentry_sdk.capture_exception(exception)
    
    except ImportError:
        pass


def capture_message(message: str, level: str = "info", context: Dict[str, Any] = None):
    """
    Capture message to Sentry
    
    Args:
        message: The message to capture
        level: Log level (debug, info, warning, error, critical)
        context: Additional context data
    """
    try:
        import sentry_sdk
        
        level_map = {
            "debug": "debug",
            "info": "info",
            "warning": "warning",
            "error": "error",
            "critical": "fatal"
        }
        
        if context:
            with sentry_sdk.push_scope() as scope:
                for key, value in context.items():
                    scope.set_context(key, {"data": value})
                sentry_sdk.capture_message(message, level_map.get(level, "info"))
        else:
            sentry_sdk.capture_message(message, level_map.get(level, "info"))
    
    except ImportError:
        pass
