from django.urls import path
from . import views

urlpatterns = [
    path('apply/', views.application_form, name='application_form'),
]