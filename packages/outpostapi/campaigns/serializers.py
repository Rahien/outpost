from rest_framework import serializers
from campaigns.models import Campaign, CampaignCharacter, CampaignInvite, CampaignUser, Event, TownGuardPerk, ActiveTownGuardPerk, ActiveScenario
from django.contrib.auth.models import User
from campaigns.scenario_map import scenarios
from characters.serializers import CharacterMasterySerializer, CharacterPerkSerializer, CharacterSerializer
from characters.models import Character


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
    campaign = CampaignSerializer(read_only=True, many=False)

    class Meta:
        model = CampaignInvite
        fields = ['id', 'invited_by', 'user',
                  'accepted_at', 'created_at', 'rejected_at', 'campaign']
        read_only_fields = ["id", "created_at", "accepted_at",
                            "rejected_at", 'invited_by', 'user', 'campaign']


class CampaignCharacterInfoSerializer(serializers.ModelSerializer):
    perks = CharacterPerkSerializer(
        read_only=True, many=True, source="characterperk_set")
    masteries = CharacterMasterySerializer(
        read_only=True, many=True, source="charactermastery_set")

    class Meta:
        model = Character
        fields = ['id', 'name', 'class_name',
                  'xp', 'masteries', 'user', 'perks']


class CampaignCharacterSerializer(serializers.ModelSerializer):
    character = CampaignCharacterInfoSerializer(read_only=True, many=False)

    def to_representation(self, instance):
        c = super().to_representation(instance)
        return {
            "id": c['character']["id"],
            "xp": c['character']["xp"],
            "perk_count": len([p for p in c['character']['perks'] if p['active']]),
            "mastery_count": len([m for m in c['character']['masteries'] if m['active']]),
            "retired_at": c['retired_at'],
            "class_name": c['character']['class_name'],
            "user": c['character']['user'],
            "name": c['character']['name'],
        }

    class Meta:
        model = CampaignCharacter
        fields = '__all__'


class CampaignDetailSerializer(serializers.ModelSerializer):
    perks = ActiveTownGuardPerkSerializer(
        read_only=True, many=True, source="activetownguardperk_set")
    events = EventSerializer(read_only=True, many=True, source="event_set")
    players = UserSerializer(read_only=True, many=True, source="users")
    characters = CampaignCharacterSerializer(
        read_only=True, many=True, source="campaigncharacter_set")
    invites = serializers.SerializerMethodField('get_invites')

    def get_invites(self, campaign):
        invites = CampaignInvite.objects.all().filter(
            campaign_id=campaign.id,
            accepted_at=None,
            rejected_at=None
        )
        serializer = CampaignInviteSerializer(
            instance=invites, many=True, context=self.context)

        return serializer.data

    class Meta:
        model = Campaign
        fields = "__all__"
        read_only_fields = ["id", "created_at",
                            "perks", "events", 'players', 'invites', 'characters']


class ActiveScenarioSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        scenario = super().to_representation(instance)

        merged_scenario = scenario | scenarios[scenario['scenario']]
        merged_scenario["links"] = [
            scenarios[link] for link in merged_scenario.get("links", [])
        ]
        merged_scenario["origins"] = [
            scenarios[origin] for origin in merged_scenario.get("origins", [])
        ]
        return merged_scenario
    class Meta:
        model = ActiveScenario
        fields = "__all__"
        read_only_fields = ["id", "created_at"]
