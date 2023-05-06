from django.contrib import admin
from .models import Character, Perk, CharacterPerk, Mastery, CharacterMastery

admin.site.register(Character)
admin.site.register(Perk)
admin.site.register(CharacterPerk)
admin.site.register(Mastery)
admin.site.register(CharacterMastery)

