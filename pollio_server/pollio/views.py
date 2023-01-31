from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
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
            username=data["username"], password=data["password"]).values())
        if user:
            return JsonResponse(user[0], safe=False)
        else:
            return JsonResponse({'error': 'User not found'})
    else:
        return JsonResponse({'Error': 'Invalid request method'})
