from django.shortcuts import render
from rest_framework import generics
from .models import Job
from .serializers import JobSerializer

class JobListCreateAPIView(generics.ListCreateAPIView):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
