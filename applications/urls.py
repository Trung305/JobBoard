from django.urls import path
from .views import ApplicationListCreateAPIView

urlpatterns = [
    path('application/', ApplicationListCreateAPIView.as_view(), name = 'application-list-create')
]