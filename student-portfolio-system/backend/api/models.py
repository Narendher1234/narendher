from django.db import models

class Submission(models.Model):
    student_name = models.CharField(max_length=100, default="")
    title = models.CharField(max_length=200)
    description = models.TextField()
    tags = models.CharField(max_length=200, blank=True)
    file = models.FileField(upload_to='uploads/', null=True, blank=True)
    status = models.CharField(max_length=50, default="Submitted")
    marks = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class SubmissionVersion(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    file = models.FileField(upload_to='versions/')
    version_no = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)


class Portfolio(models.Model):
    student_name = models.CharField(max_length=100, default="")
    summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    
