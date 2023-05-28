from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView

from campaigns.models import Campaign, CampaignCharacter, CampaignInvite, Event, TownGuardPerk, ActiveTownGuardPerk
from campaigns.serializers import CampaignCharacterSerializer, CampaignDetailSerializer, CampaignInviteSerializer, CampaignSerializer, EventSerializer
from django.utils import timezone
from django.contrib.auth.models import User

from characters.models import Character


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


class CampaignInviteListApiView(APIView):

    def post(self, request, campaign_id, *args, **kwargs):
        '''
        Creates an invite for the campaign
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        target_user = User.objects.filter(
            username=request.data['username']).first()
        if not target_user:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        existing_invite = CampaignInvite.objects.filter(
            user_id=target_user.id, campaign_id=campaign_id, accepted_at=None, rejected_at=None)
        if campaign.users.filter(id=target_user.id).exists() or existing_invite:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        CampaignInvite.objects.create(
            campaign_id=campaign_id,
            user_id=target_user.id,
            invited_by_id=request.user.id,
            created_at=timezone.now()
        )

        campaign = Campaign.objects.get(
            id=campaign_id)
        serializer = CampaignDetailSerializer(campaign)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MyCampaignInvitesApiView(APIView):

    def get(self, request, *args, **kwargs):
        '''
        Returns all invites for the user
        '''
        invites = CampaignInvite.objects.filter(
            user_id=request.user.id, accepted_at=None, rejected_at=None)
        serializer = CampaignInviteSerializer(invites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CampaignUserDetailApiView(APIView):

    def delete(self, request, campaign_id, user_id, *args, **kwargs):
        '''
        Removes the user from the campaign
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        if not campaign.users.filter(id=user_id).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if campaign.users.count() == 1:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        campaign.users.remove(user_id)
        campaign.save()

        campaign = Campaign.objects.get(
            id=campaign_id)
        serializer = CampaignDetailSerializer(campaign)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CampaignInviteDetailApiView(APIView):

    def patch(self, request, campaign_id, invite_id, *args, **kwargs):
        '''
        Accepts or rejects the invite with given invite_id
        '''
        campaign = Campaign.objects.get(id=campaign_id)

        invite = CampaignInvite.objects.get(id=invite_id)
        if not invite:
            return Response(
                {"res": "Object with invite id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if invite.user_id != request.user.id:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if invite.accepted_at or invite.rejected_at:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.data.get('accepted_at'):
            invite.accepted_at = timezone.now()
            invite.save()
            campaign.users.add(invite.user_id)
            campaign.save()
            campaign = Campaign.objects.get(
                id=campaign_id)
            serializer = CampaignDetailSerializer(campaign)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        if request.data.get('rejected_at'):
            invite.rejected_at = timezone.now()
            invite.save()
            campaign = Campaign.objects.get(
                id=campaign_id)
            serializer = CampaignDetailSerializer(campaign)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, campaign_id, invite_id, *args, **kwargs):
        '''
        Deletes the invite with given invite_id
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        invite = CampaignInvite.objects.get(id=invite_id)
        if not invite:
            return Response(
                {"res": "Object with invite id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        if invite.accepted_at or invite.rejected_at:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        invite.delete()

        campaign = Campaign.objects.get(
            id=campaign_id)
        serializer = CampaignDetailSerializer(campaign)

        return Response(data=serializer.data, status=status.HTTP_200_OK)


class CampaignCharacterListApiView(APIView):
    def post(self, request, campaign_id, *args, **kwargs):
        '''
        Adds a character to the campaign
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        character = Character.objects.get(id=request.data['character_id'])
        if not character:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if not character.user_id == request.user.id:
            return Response(status=status.HTTP_403_FORBIDDEN)

        campaign.characters.add(character)
        campaign.save()

        campaign = Campaign.objects.get(
            id=campaign_id)
        serializer = CampaignDetailSerializer(campaign)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CampaignCharacterDetailApiView(APIView):
    def put(self, request, campaign_id, character_id, *args, **kwargs):
        '''
        Updates the character with given character_id
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        character = Character.objects.get(id=character_id)
        if not character:
            return Response(
                {"res": "Object with character id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not campaign.characters.filter(id=character_id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        target = CampaignCharacter.objects.get(
            character_id=character_id, campaign_id=campaign_id)
        serializer = CampaignCharacterSerializer(
            target, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            campaign = Campaign.objects.get(
                id=campaign_id)
            serializer = CampaignDetailSerializer(campaign)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, campaign_id, character_id, *args, **kwargs):
        '''
        Deletes the character with given character_id
        '''
        campaign = Campaign.objects.get(id=campaign_id)
        if not campaign.users.filter(id=request.user.id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        character = Character.objects.get(id=character_id)
        if not character:
            return Response(
                {"res": "Object with character id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not campaign.characters.filter(id=character_id).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        target = CampaignCharacter.objects.get(
            character_id=character_id, campaign_id=campaign_id)
        target.delete()

        campaign = Campaign.objects.get(
            id=campaign_id)
        serializer = CampaignDetailSerializer(campaign)
        return Response(serializer.data, status=status.HTTP_200_OK)
