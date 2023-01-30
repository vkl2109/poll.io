from django.urls import path
from . import views

urlpatterns = [
    path("", views.index),
    path("users/<int:id>", views.user_show, name="user_show")
]