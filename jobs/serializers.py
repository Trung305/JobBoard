from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework import generics

from company.models import Company
from .models import Job,UserProfile
from applications.models import Application
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)  # Lấy tên công ty
    has_applied = serializers.SerializerMethodField()
    permision_class = [AllowAny]
    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'location', 'company_name', 'created_at','has_applied']
    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Application.objects.filter(job=obj, email=request.user.email).exists()
        return False
class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'groups']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]
class CompanyRegisterSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(max_length=255, write_only=True)  # Tách ra làm trường riêng
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'company_name']
        extra_kwargs = {'password': {'write_only': True}}
    def validate(self, data):
        if User.objects.filter(username=data.get('username')).exists():
            raise serializers.ValidationError({"username": ["This username is already taken."]})
        if User.objects.filter(email=data.get('email')).exists():
            raise serializers.ValidationError({"email": ["This email is already registered."]})
        return data
    def create(self, validated_data):
        company_name = validated_data.pop('company_name')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        employers_group, _ = Group.objects.get_or_create(name='Employers')
        user.groups.add(employers_group)
        company, _ = Company.objects.get_or_create(name=company_name)
        UserProfile.objects.create(user=user, company=company)
        return user
