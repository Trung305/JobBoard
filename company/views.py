from django.shortcuts import render
from rest_framework import generics
from .models import Company
from .serializers import CompanySerializers

class CompanyListCreateAPIView(generics.ListCreateAPIView):
    queryset = Company.objects.all().order_by('-created_at')
    serializer_class = CompanySerializers
