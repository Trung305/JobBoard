from django.shortcuts import render
from rest_framework import generics
from .permissions import IsCandidate, IsEmployer, IsAdmin, IsEmployerForCompany
from accounts.serializers import UserSerializer
from .models import Job, UserProfile
from .serializers import JobSerializer, CompanyRegisterSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.db.models import Q
from django.contrib.auth.models import User, Group
from .models import Company
from rest_framework.response import Response
from rest_framework.views import APIView

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    def perform_create(self, serializer):
        user = serializer.save()
        candidates_group = Group.objects.get(name='Candidates')
        user.groups.add(candidates_group)
        UserProfile.objects.create(user=user)

class JobListCreateAPIView(generics.ListCreateAPIView):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains = search_query) 
            )
        return queryset
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsEmployer()]
        return [AllowAny()]
    def perform_create(self, serializer):
        profile = UserProfile.objects.get(user=self.request.user)
        if not profile.company:
            raise serializer.ValidationError("Employer must be associated with a company.")
        serializer.save(company=profile.company)
class JobRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Job.objects.all().select_related('company')
    serializer_class = JobSerializer
    permission_class = [AllowAny]
    lookup_field ='id'
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    def perform_create(self, serializer):
        user = serializer.save()
        candidates_group = Group.objects.get(name='Candidates')
        user.groups.add(candidates_group)
        UserProfile.objects.create(user=user)  # company=None cho Candidate

class UserInfoView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user
class JobRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all().select_related('company')
    serializer_class = JobSerializer
    lookup_field = 'id'
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsEmployer(), IsEmployerForCompany()]
        return [AllowAny()]
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
class CompanyAdminView(APIView):
    permission_classes = [IsEmployer]
    def get(self, request):
        profile = UserProfile.objects.get(user=request.user)
        if not profile.company:
            return Response({"detail": "No company associated."}, status=400)
        jobs = Job.objects.filter(company=profile.company).order_by('-created_at')
        serializer = JobSerializer(jobs, many=True, context={'request': request})
        return Response({
            'company': profile.company.name,
            'jobs': serializer.data
        })

class CompanyRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CompanyRegisterSerializer
    permission_classes = [AllowAny]

class JobRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all().select_related('company')
    serializer_class = JobSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsEmployer(), IsEmployerForCompany()]
        return [AllowAny()]
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context