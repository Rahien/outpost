from rest_framework import serializers
from .models import Character
class CharacterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Character
        fields = ["id","name", "class_name", "created_at", "user"]
        read_only_fields = ["id", "created_at"]
