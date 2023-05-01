from rest_framework import serializers
from .models import Character, Perk, CharacterPerk

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
            "perk_id": char_perk["perk"]["id"],
            "order": char_perk["perk"]["order"]
        }

    class Meta:
        model = CharacterPerk
        fields = ["perk", "character_id", "id", "active"]
        read_only_fields = ["id"]

class CharacterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Character
        fields = ["id","name", "class_name", "created_at", "user"]
        read_only_fields = ["id", "created_at"]


class CharacterDetailSerializer(serializers.ModelSerializer):
    perks = CharacterPerkSerializer(read_only=True, many=True, source="characterperk_set")

    class Meta:
        model = Character
        fields = "__all__"
        read_only_fields = ["id", "created_at", "perks"]
