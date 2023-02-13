from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
import json
from .models import User

# Create your views here.

def index(request):
    return HttpResponse("Pollio")

@csrf_exempt
def user_show(request, id):
    try:
        user = User.objects.get(id=id)
        return JsonResponse(user.to_dict(), safe=False, status=201)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = list(User.objects.filter(
            username=data["username"], password=data["password"]).values())[0]
        if user:
            return JsonResponse(user["username"], safe=False, status=200)
        else:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'Error': 'Invalid request method'}, status=400)


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        checkUser = list(User.objects.filter(
            username=data["username"], password=data["password"]).values())
        if checkUser:
            return JsonResponse({'error': 'User already exists'}, status=400)
        else:
            user = User(avatarBase64=data["avatarBase64"], password=data["password"], username=data["username"])
            try:
                user.full_clean()
                user.save()
                return JsonResponse({'username': data["username"]}, safe=False, status=201)
            except ValidationError as e:
                return JsonResponse({'error': e}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
