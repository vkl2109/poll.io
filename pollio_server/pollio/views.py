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
        return JsonResponse({'error': 'User not found'})
