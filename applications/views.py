from django.shortcuts import render
from rest_framework import generics
from .models import Application
from .serializers import ApplicationSerializers
# Create your views here.

class ApplicationListCreateAPIView(generics.ListCreateAPIView):
    queryset = Application.objects.all().order_by('created_at')
    serializer_class = ApplicationSerializers
