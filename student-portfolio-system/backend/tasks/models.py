from django.db import models

class Submission(models.Model):
    title = models.CharField(max_length=200)
    student_name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100, blank=True, null=True)
    tags = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=50, default="Pending")
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)