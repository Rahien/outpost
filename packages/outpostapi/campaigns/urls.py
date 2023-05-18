from django.urls import path
from .views import (
  CampaignListApiView,
  CampaignDetailApiView,
)

urlpatterns = [
    path('', CampaignListApiView.as_view()),
    path('<int:campaign_id>', CampaignDetailApiView.as_view()),
]
