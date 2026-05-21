from django.db import models

class Portfolio(models.Model):

    title = models.CharField(max_length=200)

    summary = models.TextField()

    skills = models.TextField()

    github = models.URLField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title