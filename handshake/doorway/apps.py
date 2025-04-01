from django.apps import AppConfig


class DoorwayConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'doorway'

    def ready(self):
        import doorway.signals
