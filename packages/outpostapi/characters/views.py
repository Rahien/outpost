# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Character, CharacterPerk, Perk, Mastery, CharacterMastery
from .serializers import CharacterSerializer, CharacterDetailSerializer, CharacterPerkSerializer

def purge_character_perks(character):
    '''
    Helper method to delete all the perks for given character and reload the character's perks based on the new class
    '''
    perks = CharacterPerk.objects.filter(character = character)
    for perk in perks:
        perk.delete()

    character_class = character.class_name
    perks = Perk.objects.filter(class_name = character_class)
    for perk in perks:
        character_perk = CharacterPerk(character = character, perk = perk)
        character_perk.save()

def purge_character_masteries(character):
    '''
    Helper method to delete all the masteries for given character and reload the character's masteries based on the new class
    '''
    masteries = CharacterMastery.objects.filter(character = character)
    for mastery in masteries:
        mastery.delete()

    character_class = character.class_name
    masteries = Mastery.objects.filter(class_name = character_class)
    for mastery in masteries:
        character_mastery = CharacterMastery(character = character, mastery = mastery)
        character_mastery.save()

def get_character_for_user(character_id, user_id):
    character = Character.objects.get(id=character_id, user=user_id)
    if not character:
        return ( None, Response(
            {"res": "Object with character id does not exists"},
            status=status.HTTP_400_BAD_REQUEST
        ))
    return (character, None)

class  CharacterListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        '''
        List all the characters for given requested user
        '''
        characters = Character.objects.filter(user = request.user.id)
        serializer = CharacterSerializer(characters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        '''
        Create the Character with given data
        '''
        data = {
            'name': request.data.get('name'),
            'class_name': request.data.get('class_name'),
            'user': request.user.id
        }
        serializer = CharacterSerializer(data=data)

        if serializer.is_valid():
            new_character = serializer.save()
            purge_character_perks(new_character)
            purge_character_masteries(new_character)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CharacterDetailApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, character_id, *args, **kwargs):
        '''
        Retrieves the Character with given character_id
        '''
        (character_instance, error) = get_character_for_user(character_id, request.user.id)
        if error:
            return error

        serializer = CharacterDetailSerializer(character_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, character_id, *args, **kwargs):
        '''
        Updates the character with given character_id if exists
        '''
        (character_instance, error) = get_character_for_user(character_id, request.user.id)
        if error:
            return error

        original_class = character_instance.class_name
        data = request.data
        if data.get('user'):
          del data['user']

        serializer = CharacterDetailSerializer(character_instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            if(data.get('class_name') and original_class):
                purge_character_perks(character_instance)
                purge_character_masteries(character_instance)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, character_id, *args, **kwargs):
        '''
        Deletes the character with given character_id if exists
        '''
        (character_instance, error) = get_character_for_user(character_id, request.user.id)
        if error:
            return error

        character_instance.delete()
        return Response(
            {"res": "Object deleted!"},
            status=status.HTTP_200_OK
        )

class CharacterPerkListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, character_id, *args, **kwargs):
        '''
        List all the character perks for the given character and user
        '''
        (_, error) = get_character_for_user(character_id, request.user.id)
        if error:
            return error

        perks = CharacterPerk.objects.get(character_id=character_id)
        serializer = CharacterPerkSerializer(perks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CharacterPerkDetailApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def put(self, request, character_id, perk_id, *args, **kwargs):
        '''
        List all the character perks for the given character and user
        '''
        (character, error) = get_character_for_user(character_id, request.user.id)
        if error:
            return error

        perk = CharacterPerk.objects.get(character_id=character_id, id=perk_id)
        if not perk:
            return Response(
                {"res": "Object with perk id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        perk_info = Perk.objects.get(id=perk.perk_id)
        if not perk_info:
            return Response(
                {"res": "Referenced perk does not exist"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        active = min(perk_info.max_active, max(request.data.get('active', 0), 0))

        if active is not None:
            perk.active = active
            perk.save()

        character = Character.objects.get(id=character_id, user=request.user.id)
        serializer = CharacterDetailSerializer(character)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CharacterMasteryDetailApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, character_id, mastery_id, *args, **kwargs):
        (character, error) = get_character_for_user(character_id, request.user.id)
        if error:
            return error

        mastery = CharacterMastery.objects.get(character_id=character_id, id=mastery_id)
        if not mastery:
            return Response(
                {"res": "Object with mastery id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        mastery_info = Mastery.objects.get(id=mastery.mastery_id)
        if not mastery_info:
            return Response(
                {"res": "Referenced mastery does not exist"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        active = request.data.get('active', False)

        mastery.active = active
        mastery.save()

        character = Character.objects.get(id=character_id, user=request.user.id)
        serializer = CharacterDetailSerializer(character)
        return Response(serializer.data, status=status.HTTP_200_OK)


