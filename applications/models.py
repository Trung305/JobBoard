from django.db import models
from jobs.models import Job
# Create your models here.
class Application(models.Model):
    job = models.ForeignKey(Job, on_delete= models.CASCADE, related_name='applications')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    website = models.URLField(blank = True, null = True)
    resume = models.FileField(upload_to='resume/')
    cover_letter = models.TextField(blank=True, null=True) # Thư giới thiệu (optional)
    created_at = models.DateTimeField(auto_now_add=True)  # Ngày nộp hồ sơ

def __str__(self):
    return f"{self.name} - {self.job.title}"