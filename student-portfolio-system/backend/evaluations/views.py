from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Evaluation
from .serializers import EvaluationSerializer

class EvaluationView(generics.ListCreateAPIView):

    queryset = Evaluation.objects.all()

    serializer_class = EvaluationSerializer