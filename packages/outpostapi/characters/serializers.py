from rest_framework import serializers
from .models import Character, Perk, CharacterPerk, Mastery, CharacterMastery


class PerkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Perk
        fields = "__all__"
        read_only_fields = ["id"]


class CharacterPerkSerializer(serializers.ModelSerializer):
    perk = PerkSerializer(read_only=True, many=False)

    def to_representation(self, instance):
        char_perk = super().to_representation(instance)
        return {
            **char_perk["perk"],
            "id": char_perk["id"],
            "active": char_perk["active"],
            "connected": char_perk["perk"]["connected"],
            "perk_id": char_perk["perk"]["id"],
            "order": char_perk["perk"]["order"]
        }

    class Meta:
        model = CharacterPerk
        fields = ["perk", "character_id", "id", "active"]
        read_only_fields = ["id"]


class MasterySerializer(serializers.ModelSerializer):

    class Meta:
        model = Mastery
        fields = "__all__"
        read_only_fields = ["id"]


class CharacterMasterySerializer(serializers.ModelSerializer):
    mastery = MasterySerializer(read_only=True, many=False)

    def to_representation(self, instance):
        char_mastery = super().to_representation(instance)
        return {
            **char_mastery["mastery"],
            "id": char_mastery["id"],
            "active": char_mastery["active"],
            "mastery_id": char_mastery["mastery"]["id"],
            "order": char_mastery["mastery"]["order"]
        }

    class Meta:
        model = CharacterMastery
        fields = ["mastery", "character_id", "id", "active"]
        read_only_fields = ["id"]


class CharacterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Character
        fields = ["id", "name", "class_name", "created_at", "user"]
        read_only_fields = ["id", "created_at"]


class CharacterDetailSerializer(serializers.ModelSerializer):
    perks = CharacterPerkSerializer(
        read_only=True, many=True, source="characterperk_set")
    masteries = CharacterMasterySerializer(
        read_only=True, many=True, source="charactermastery_set")

    class Meta:
        model = Character
        fields = "__all__"
        read_only_fields = ["id", "created_at", "perks", "masteries"]
