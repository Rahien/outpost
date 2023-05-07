from django.urls import path
from .views import (
    CharacterListApiView,
    CharacterDetailApiView,
    CharacterPerkListApiView,
    CharacterPerkDetailApiView,
    CharacterMasteryDetailApiView
)

urlpatterns = [
    path('', CharacterListApiView.as_view()),
    path('<int:character_id>', CharacterDetailApiView.as_view()),
    path('<int:character_id>/perks', CharacterPerkListApiView.as_view()),
    path('<int:character_id>/perks/<int:perk_id>', CharacterPerkDetailApiView.as_view()),
    path('<int:character_id>/masteries/<int:mastery_id>', CharacterMasteryDetailApiView.as_view()),
]
