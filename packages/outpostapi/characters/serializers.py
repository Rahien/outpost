from rest_framework import serializers
from .models import Character, Perk, CharacterPerk
class CharacterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Character
        fields = ["id","name", "class_name", "created_at", "user"]
        read_only_fields = ["id", "created_at"]


class CharacterDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Character
        fields = "__all__"
        read_only_fields = ["id", "created_at"]

class PerkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Perk
        fields = "__all__"
        read_only_fields = ["id"]

class CharacterPerkSerializer(serializers.ModelSerializer):
    perk = PerkSerializer(read_only=True, many=False)

    class Meta:
        model = CharacterPerk
        fields = "__all__"
        read_only_fields = ["id"]
