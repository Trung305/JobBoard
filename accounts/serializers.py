from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'groups', 'is_staff', 'is_superuser']
        extra_kwargs = {'password': {'write_only': True}}
    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]