# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Character, CharacterPerk, Perk
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
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CharacterDetailApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, character_id, user_id):
        '''
        Helper method to get the object with given character_id
        '''
        try:
            return Character.objects.get(id=character_id, user = user_id)
        except Character.DoesNotExist:
            return None

    def get(self, request, character_id, *args, **kwargs):
        '''
        Retrieves the Character with given character_id
        '''
        character_instance = self.get_object(character_id, request.user.id)
        if not character_instance:
            return Response(
                {"res": "Object with character id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CharacterDetailSerializer(character_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, character_id, *args, **kwargs):
        '''
        Updates the character with given character_id if exists
        '''
        character_instance = self.get_object(character_id, request.user.id)

        if not character_instance:
            return Response(
                {"res": "Object with character id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        original_class = character_instance.class_name
        data = request.data
        if data.get('user'):
          del data['user']

        serializer = CharacterDetailSerializer(character_instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            if(data.get('class_name') and original_class):
                purge_character_perks(character_instance)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, character_id, *args, **kwargs):
        '''
        Deletes the character with given character_id if exists
        '''
        character_instance = self.get_object(character_id, request.user.id)
        if not character_instance:
            return Response(
                {"res": "Object with character id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
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
        character = Character.objects.get(id=character_id, user=request.user.id)
        if not character:
            return Response(
                {"res": "Object with character id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        perks = CharacterPerk.objects.get(character_id=character_id)
        serializer = CharacterPerkSerializer(perks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CharacterPerkDetailApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def put(self, request, character_id, perk_id, *args, **kwargs):
        '''
        List all the character perks for the given character and user
        '''
        character = Character.objects.get(id=character_id, user=request.user.id)
        if not character:
            return Response(
                {"res": "Object with character id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        perk = CharacterPerk.objects.get(character_id=character_id, id=perk_id)
        active = request.data.get('active')

        if active is not None:
            perk.active = active
            perk.save()

        character = Character.objects.get(id=character_id, user=request.user.id)
        serializer = CharacterDetailSerializer(character)
        return Response(serializer.data, status=status.HTTP_200_OK)


