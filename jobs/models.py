from django.db import models
from company.models import Company

# Create your models here.
class Job(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.TextField(max_length =255)
    desscription = models.TextField()
    location = models.CharField(max_length =255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs', null=True)
    created_at = models.DateTimeField(auto_now_add = True)

def __str__(self):
    return self.title
