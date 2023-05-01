from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Character(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField("created at")
    class_name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete = models.CASCADE, blank = True, null = True)
    xp = models.IntegerField(default=0)
    gold= models.IntegerField(default=0)
    hide = models.IntegerField(default=0)
    metal = models.IntegerField(default=0)
    wood = models.IntegerField(default=0)
    arrowvine = models.IntegerField(default=0)
    axenut = models.IntegerField(default=0)
    corpsecap = models.IntegerField(default=0)
    flamefruit = models.IntegerField(default=0)
    rockroot = models.IntegerField(default=0)
    snowthistle = models.IntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    perk_tags = models.IntegerField(default=0)


    def __str__(self):
      return f"{self.name} [{self.class_name}]"

    def save(self, *args, **kwargs):
      if not self.id:
         self.created_at = timezone.now()

      return super(Character, self).save(*args, **kwargs)


class Perk(models.Model):
    description = models.TextField(blank=True, null=True)
    class_name = models.CharField(max_length=200)
    order = models.IntegerField(default=0)

    def __str__(self):
      return f"{self.description}"

    class Meta:
       ordering = ['order']
       unique_together = ['class_name', 'order']

class CharacterPerk(models.Model):
    character = models.ForeignKey(Character, on_delete = models.CASCADE, blank = True, null = True)
    perk = models.ForeignKey(Perk, on_delete = models.CASCADE, blank = True, null = True)
    active = models.BooleanField(default=False)

    class Meta:
       unique_together = ['character', 'perk']


    def __str__(self):
      return f"{self.character.name} [perk {self.perk.id}: {self.active}]"
