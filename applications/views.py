from rest_framework import generics
from .models import Application
from .serializers import ApplicationSerializers
from jobs.permissions import IsCandidate, IsEmployer, IsEmployerForCompany
from jobs.models import UserProfile
from company.models import Company  # Import Company
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAuthenticated,AllowAny

class ApplicationListCreateAPIView(generics.ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializers
    permission_classes = [AllowAny]
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsCandidate()]
        return [IsEmployer()]
    def get_queryset(self):
        if self.request.user.groups.filter(name='Employers').exists():
            profile = UserProfile.objects.get(user=self.request.user)
            return Application.objects.filter(job__company=profile.company)
        return Application.objects.none()

class ApplicationRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializers
    permission_classes = [IsEmployer, IsEmployerForCompany]