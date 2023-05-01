from django.contrib import admin
from .models import Character, Perk, CharacterPerk

admin.site.register(Character)
admin.site.register(Perk)
admin.site.register(CharacterPerk)

