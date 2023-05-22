from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView

from campaigns.models import Campaign, Event, TownGuardPerk, ActiveTownGuardPerk
from campaigns.serializers import CampaignDetailSerializer, CampaignSerializer, EventSerializer


def add_campaign_perks(campaign):
    '''
    Helper method to add default campaign perks
    '''
    perks = TownGuardPerk.objects.all()
    for perk in perks:
        campaign_perk = ActiveTownGuardPerk(campaign=campaign, perk=perk)
        campaign_perk.save()


def add_campaign_events(campaign):
    '''
    Helper method to add default campaign events
    '''
    events = [
        Event(campaign=campaign, section="32.3", week=5),
        Event(campaign=campaign, section="183.3", week=10),
        Event(campaign=campaign, section="21.4", week=10),
        Event(campaign=campaign, section="129.3", week=20),
        Event(campaign=campaign, section="183.3", week=25),
        Event(campaign=campaign, section="183.3", week=30),
        Event(campaign=campaign, section="184.1", week=40),
        Event(campaign=campaign, section="137.2", week=80),
    ]

    for event in events:
        event.save()


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
        data = request.data
        serializer = CampaignDetailSerializer(data=data)

        if serializer.is_valid():
            new_campaign = serializer.save()
            new_campaign.users.add(request.user.id)
            new_campaign.save()
            add_campaign_perks(new_campaign)
            add_campaign_events(new_campaign)

            return Response(CampaignDetailSerializer(new_campaign).data, status=status.HTTP_201_CREATED)

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

    def patch(self, request, campaign_id, *args, **kwargs):
        '''
        Updates the campaign with given campaign_id if exists
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        data = request.data
        if data.get('user'):
            del data['user']

        serializer = CampaignDetailSerializer(
            campaign, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, campaign_id, *args, **kwargs):
        '''
        Deletes the Campaign with given campaign_id
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        campaign.delete()
        return Response(status=status.HTTP_200_OK)


class TownGuardPerkDetailApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, campaign_id, perk_id, *args, **kwargs):
        '''
        update the town guard perk for this campaign
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        perk = ActiveTownGuardPerk.objects.get(
            campaign_id=campaign_id, id=perk_id)
        if not perk:
            return Response(
                {"res": "Object with perk id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        perk_info = TownGuardPerk.objects.get(id=perk.perk_id)
        if not perk_info:
            return Response(
                {"res": "Referenced perk does not exist"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        active = request.data.get('active', '').split(';')
        available = perk_info.sections.split(';')
        active = list(filter(lambda x: x in available, active))

        active = ';'.join(active)

        perk.active = active
        perk.save()

        campaign = Campaign.objects.get(
            id=campaign_id)
        serializer = CampaignDetailSerializer(campaign)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EventListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, campaign_id, *args, **kwargs):
        '''
        Creates an event for the campaign
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        data = request.data
        data['campaign'] = campaign_id
        serializer = EventSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            campaign = Campaign.objects.get(
                id=campaign_id)
            serializer = CampaignDetailSerializer(campaign)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class EventDetailApiView(APIView):

    def delete(self, request, campaign_id, event_id, *args, **kwargs):
        '''
        Deletes the event with given event_id
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        event = Event.objects.get(id=event_id)
        if not event:
            return Response(
                {"res": "Object with event id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        event.delete()

        campaign = Campaign.objects.get(
            id=campaign_id)
        serializer = CampaignDetailSerializer(campaign)
        return Response(serializer.data, status=status.HTTP_200_OK)
