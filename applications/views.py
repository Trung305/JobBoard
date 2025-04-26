from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Application
from .serializers import ApplicationSerializers
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class ApplicationListCreateAPIView(generics.ListCreateAPIView):
    queryset = Application.objects.all().order_by('created_at')
    serializer_class = ApplicationSerializers
    permission_classes = [AllowAny] 