from django.db import models
from submissions.models import Submission

class Evaluation(models.Model):

    submission = models.ForeignKey(
        Submission,
        on_delete=models.CASCADE
    )

    marks = models.IntegerField()

    feedback = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.submission.title