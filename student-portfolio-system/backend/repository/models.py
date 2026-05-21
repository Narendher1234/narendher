from django.db import models

class Submission(models.Model):

    title = models.CharField(
        max_length=200
    )

    description = models.TextField()

    tags = models.CharField(
        max_length=200
    )

    file = models.FileField(
        upload_to='submissions/'
    )

    status = models.CharField(
        max_length=100,
        default="Submitted"
    )

    marks = models.IntegerField(
        null=True,
        blank=True
    )

    feedback = models.TextField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.title