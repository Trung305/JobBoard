from django.db import models

# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=255)
    website = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

def __str__(self):
    return self.name