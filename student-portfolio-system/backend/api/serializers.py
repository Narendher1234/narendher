from rest_framework import serializers
from .models import Submission, SubmissionVersion, Portfolio


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = "__all__"


class VersionSerializer(serializers.ModelSerializer):

    # 🔥 IMPORTANT FIX
    submission = serializers.PrimaryKeyRelatedField(
        queryset=Submission.objects.all()
    )

    class Meta:
        model = SubmissionVersion
        fields = "__all__"


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = "__all__"

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = "__all__"