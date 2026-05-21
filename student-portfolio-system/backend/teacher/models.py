
# Create your models here.
from django.db import models

class Teacher(models.Model):

    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, default="teacher")

    def __str__(self):
        return self.username