from django.urls import path
from .views import JobListCreateAPIView, JobRetrieveAPIView, CompanyAdminView,CompanyRegisterView, JobRetrieveUpdateDestroyAPIView
from applications.views import ApplicationListCreateAPIView
urlpatterns = [
    path('jobs/', JobListCreateAPIView.as_view(), name='job-list'),
    path('jobs/<int:id>', JobRetrieveAPIView.as_view(), name='job-details'),
    path('api/apply/', ApplicationListCreateAPIView.as_view(), name='apply'),
    path('company/admin/', CompanyAdminView.as_view(), name='company_admin'),
    path('company/register/', CompanyRegisterView.as_view(), name='company_register'),
    path('jobs/', JobListCreateAPIView.as_view(), name='job-list-create'),
    path('jobs/<int:id>/', JobRetrieveUpdateDestroyAPIView.as_view(), name='job-detail'),
]
