from django.shortcuts import render
from rest_framework import generics
from .models import Job
from .serializers import JobSerializer
from rest_framework.permissions import AllowAny

class JobListCreateAPIView(generics.ListCreateAPIView):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains = search_query) |
                Q(desscription__icontains = search_query)|
                Q(location_icontains = search_query) |
                Q(company__name__icontains = search_query)
            )
        return queryset
    def get_serialzers_class(self):
        context = super().get_serialzers_context()
        context.update({"request" : self.request})
        return context
class JobRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Job.objects.all().select_related('company')
    serialzers_class = JobSerializer
    permission_class = [AllowAny]
    lookup_field ='id'
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
