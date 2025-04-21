# company/urls.py
from django.urls import path
from .views import CompanyListCreateAPIView

urlpatterns = [
    path('company/', CompanyListCreateAPIView.as_view(), name='company-list-create'),
]
