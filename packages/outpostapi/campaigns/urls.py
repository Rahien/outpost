from django.urls import path
from .views import (
    CampaignListApiView,
    CampaignDetailApiView,
    TownGuardPerkDetailApiView,
)

urlpatterns = [
    path('', CampaignListApiView.as_view()),
    path('<int:campaign_id>', CampaignDetailApiView.as_view()),
    path('<int:campaign_id>/perks/<int:perk_id>',
         TownGuardPerkDetailApiView.as_view()),
]
