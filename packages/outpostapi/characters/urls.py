from django.urls import path
from .views import (
    CharacterListApiView,
    CharacterDetailApiView
)

urlpatterns = [
    path('api', CharacterListApiView.as_view()),
    path('api/<int:character_id>', CharacterDetailApiView.as_view()),
]
