from rest_framework import serializers
from .models import Application

class ApplicationSerializers(serializers.ModelSerializer):
    has_applied = serializers.SerializerMethodField()
    class Meta:
        model = Application
        fields = ['job', 'name', 'email', 'website', 'resume', 'cover_letter',]
        read_only_fields = ['created_at']
    def validate(seft, data):
        if Application.objects.filter(job=data['job'], email=data['email']).exists():
            raise serializers.ValidationError("Bạn đã apply job này rồi")
        return data