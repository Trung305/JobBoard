from django.db import models
from company.models import Company
from django.contrib.auth.models import User

# Create your models here.
class Job(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.TextField(max_length =255)
    description = models.TextField()
    location = models.CharField(max_length =255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs', null=True)
    created_at = models.DateTimeField(auto_now_add = True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return self.user.username
    
def __str__(self):
    return self.title
