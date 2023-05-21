from rest_framework import serializers
from campaigns.models import Campaign, Event, TownGuardPerk, ActiveTownGuardPerk
from characters.serializers import PerkSerializer


class TownGuardPerkSerializer(serializers.ModelSerializer):

    class Meta:
        model = TownGuardPerk
        fields = "__all__"
        read_only_fields = ["id"]


class ActiveTownGuardPerkSerializer(serializers.ModelSerializer):
    perk = TownGuardPerkSerializer(read_only=True, many=False)

    def to_representation(self, instance):
        c_perk = super().to_representation(instance)
        return {
            **c_perk["perk"],
            "id": c_perk["id"],
            "active": c_perk["active"],
            "perk_id": c_perk["perk"]["id"],
            "sections": c_perk["perk"]["sections"],
            "order": c_perk["perk"]["order"]
        }

    class Meta:
        model = ActiveTownGuardPerk
        fields = ["perk", "campaign_id", "id", "active"]
        read_only_fields = ["id"]


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = "__all__"
        read_only_fields = ["id"]


class CampaignSerializer(serializers.ModelSerializer):

    class Meta:
        model = Campaign
        fields = ['id', 'name', 'prosperity', 'created_at']
        read_only_fields = ["id", "created_at"]


class CampaignDetailSerializer(serializers.ModelSerializer):
    perks = ActiveTownGuardPerkSerializer(
        read_only=True, many=True, source="activetownguardperk_set")
    events = EventSerializer(read_only=True, many=True, source="event_set")

    class Meta:
        model = Campaign
        fields = "__all__"
        read_only_fields = ["id", "created_at", "perks", "events"]
