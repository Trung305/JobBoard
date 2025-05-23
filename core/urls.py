"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.staticfiles.views import serve
from django.views.generic import TemplateView
from jobs.views import JobListCreateAPIView, JobRetrieveAPIView, CompanyAdminView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Đăng nhập
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('accounts.urls')),
    path('api/', include('jobs.urls')),
    path('api/', include('company.urls')),
    path('api/', include('applications.urls')),
    path('', serve, kwargs={'path': 'frontend/index.html'}),
    path('index.html', serve, kwargs={'path': 'frontend/index.html'}),
    path('job_detail.html',serve,  kwargs={'path': 'frontend/job_detail.html'}),
    path('company_admin',serve,  kwargs={'path': 'frontend/company_admin.html'}),
    path('login', serve, kwargs={'path': 'frontend/login.html'}),
    path('company_login', serve, kwargs={'path': 'frontend/company_login.html'}),
    path('company_register', serve, kwargs={'path': 'frontend/company_register.html'}),
    path('company/create-job', serve, kwargs={'path': 'frontend/create-job.html'}),
]
