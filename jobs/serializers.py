from rest_framework import serializers
from rest_framework import generics
from .models import Job
from applications.models import Application
from rest_framework.permissions import AllowAny

class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)  # Lấy tên công ty
    has_applied = serializers.SerializerMethodField()
    permision_class = [AllowAny]
    class Meta:
        model = Job
        fields = ['id', 'title', 'desscription', 'location', 'company_name', 'created_at','has_applied']
    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Application.objects.filter(job=obj, email=request.user.email).exists()
        return False