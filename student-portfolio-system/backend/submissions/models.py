from django.db import models
from users.models import User

class Submission(models.Model):

    # LINK STUDENT (FOREIGN KEY)
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="submissions"
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    # SUBJECT FIELD (THIS WAS MISSING)
    subject = models.CharField(max_length=100, null=True, blank=True)

    tags = models.CharField(max_length=200, null=True, blank=True)
    file = models.FileField(upload_to="submissions/", null=True, blank=True)

    status = models.CharField(max_length=50, default="Pending")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title