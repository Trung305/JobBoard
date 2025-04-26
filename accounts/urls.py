# accounts/urls.py

from django.urls import path
from .views import RegisterView
from .views import UserInfoView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserInfoView.as_view(), name='user-info'),
]