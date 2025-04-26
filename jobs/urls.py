from django.urls import path
from .views import JobListCreateAPIView, JobRetrieveAPIView

urlpatterns = [
    path('jobs/', JobListCreateAPIView.as_view(), name='job-list'),
    path('job/<int:id>', JobRetrieveAPIView.as_view(), name='job-details')
]
