from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

from characters.models import Character, Perk


class TownGuardPerk(models.Model):
    description = models.TextField(blank=True, null=True)
    order = models.IntegerField(default=0)
    # semicolon separated list of available sections
    sections = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.description}"

    class Meta:
        ordering = ['order']


class Campaign(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField("created at")
    notes = models.TextField(blank=True, null=True)
    hide = models.IntegerField(default=0)
    metal = models.IntegerField(default=0)
    wood = models.IntegerField(default=0)
    arrowvine = models.IntegerField(default=0)
    axenut = models.IntegerField(default=0)
    corpsecap = models.IntegerField(default=0)
    flamefruit = models.IntegerField(default=0)
    rockroot = models.IntegerField(default=0)
    snowthistle = models.IntegerField(default=0)
    morale = models.IntegerField(default=0)
    soldiers = models.IntegerField(default=0)
    barracks_level = models.IntegerField(default=0)
    inspiration = models.IntegerField(default=0)
    total_defense = models.IntegerField(default=0)
    prosperity = models.IntegerField(default=0)
    perk_tags = models.IntegerField(default=0)
    characters = models.ManyToManyField(Character, through='CampaignCharacter')
    users = models.ManyToManyField(User, through='CampaignUser')
    current_week = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.name}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now()

        return super(Campaign, self).save(*args, **kwargs)


class CampaignCharacter(models.Model):
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, blank=True, null=True)
    character = models.ForeignKey(
        Character, on_delete=models.CASCADE, blank=True, null=True)
    retired_at = models.DateTimeField("retired at", blank=True, null=True)

    class Meta:
        unique_together = ['campaign', 'character']

    def __str__(self):
        return f"{self.campaign.name} [character {self.character.id}"


class CampaignUser(models.Model):
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        unique_together = ['campaign', 'user']

    def __str__(self):
        return f"{self.campaign.name} [user {self.user.id}"


class Event(models.Model):
    week = models.IntegerField(default=0)
    section = models.CharField(max_length=200)
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, blank=True, null=True)


class CampaignInvite(models.Model):
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True)
    invited_by = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name="invited_by")
    accepted_at = models.DateTimeField("accepted_at", blank=True, null=True)
    rejected_at = models.DateTimeField("rejected_at", blank=True, null=True)
    created_at = models.DateTimeField("created_at")

    def __str__(self):
        return f"{self.campaign.name} [user {self.user.id}"


class ActiveTownGuardPerk(models.Model):
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, blank=True, null=True)
    perk = models.ForeignKey(
        TownGuardPerk, on_delete=models.CASCADE, blank=True, null=True)
    # semicolon separated list of active sections
    active = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ['campaign', 'perk']

    def __str__(self):
        return f"{self.campaign.name} [perk {self.perk.id}: {self.active}]"


class ActiveScenario(models.Model):
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, blank=True, null=True
    )
    scenario = models.CharField(max_length=200)
    status = models.CharField(max_length=200, default='active')

    def __str__(self):
        return f"{self.campaign.name} [scenario {self.scenario}: {self.status}]"
