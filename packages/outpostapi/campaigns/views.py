from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView

from campaigns.models import Campaign
from campaigns.serializers import CampaignDetailSerializer, CampaignSerializer

# Create your views here.


class CampaignListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        '''
        Retrieves all Campaigns
        '''
        campaigns = Campaign.objects.filter(users__in=[request.user.id])
        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        '''
        Create the Campaign with given data
        '''
        data = {

            'name': request.data.get('name'),
            'user': request.user.id
        }
        serializer = CampaignSerializer(data=data)

        if serializer.is_valid():
            new_campaign = serializer.save()
            new_campaign.users.add(request.user.id)
            new_campaign.save()

            return Response(CampaignDetailSerializer(data=new_campaign), status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CampaignDetailApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, campaign_id, *args, **kwargs):
        '''
        Retrieves the Campaign with given campaign_id
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = CampaignDetailSerializer(campaign)
        return Response(serializer.data, status=status.HTTP_200_OK)
