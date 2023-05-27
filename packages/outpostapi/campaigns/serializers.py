from rest_framework import serializers
from campaigns.models import Campaign, CampaignInvite, CampaignUser, Event, TownGuardPerk, ActiveTownGuardPerk
from django.contrib.auth.models import User

from characters.serializers import CharacterSerializer


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


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username']


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = "__all__"
        read_only_fields = ["id"]


class CampaignSerializer(serializers.ModelSerializer):

    class Meta:
        model = Campaign
        fields = ['id', 'name', 'prosperity', 'created_at', 'current_week']
        read_only_fields = ["id", "created_at"]


class CampaignInviteSerializer(serializers.ModelSerializer):
    invited_by = UserSerializer(read_only=True, many=False)
    user = UserSerializer(read_only=True, many=False)

    class Meta:
        model = CampaignInvite
        fields = ['id', 'invited_by', 'user',
                  'accepted_at', 'created_at', 'rejected_at']
        read_only_fields = ["id", "created_at", "accepted_at",
                            "rejected_at", 'invited_by', 'user']


class CampaignDetailSerializer(serializers.ModelSerializer):
    perks = ActiveTownGuardPerkSerializer(
        read_only=True, many=True, source="activetownguardperk_set")
    events = EventSerializer(read_only=True, many=True, source="event_set")
    players = UserSerializer(read_only=True, many=True, source="users")
    characters = CharacterSerializer(
        read_only=True, many=True)
    invites = CampaignInviteSerializer(
        read_only=True, many=True, source="campaigninvite_set")

    class Meta:
        model = Campaign
        fields = "__all__"
        read_only_fields = ["id", "created_at",
                            "perks", "events", 'players', 'invites', 'characters']
