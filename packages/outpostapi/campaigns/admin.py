from django.contrib import admin

from campaigns.models import ActiveTownGuardPerk, Campaign, CampaignCharacter, CampaignUser, Event, TownGuardPerk

# Register your models here.
admin.site.register(Campaign)
admin.site.register(CampaignUser)
admin.site.register(CampaignCharacter)
admin.site.register(TownGuardPerk)
admin.site.register(Event)
admin.site.register(ActiveTownGuardPerk)
