from rest_framework import permissions
from .models import UserProfile
from .models import Company  # Import Company

class IsCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Candidates').exists()

class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Employers').exists()

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or request.user.is_superuser

class IsEmployerForCompany(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.groups.filter(name='Employers').exists():
            try:
                profile = UserProfile.objects.get(user=request.user)
                return obj.company == profile.company
            except UserProfile.DoesNotExist:
                return False
        return False