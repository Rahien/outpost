from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Character(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField("created at")
    class_name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete = models.CASCADE, blank = True, null = True)

    def __str__(self):
      return f"{self.name} [{self.class_name}]"

    def save(self, *args, **kwargs):
      if not self.id:
         self.created_at = timezone.now()

      return super(Character, self).save(*args, **kwargs)
