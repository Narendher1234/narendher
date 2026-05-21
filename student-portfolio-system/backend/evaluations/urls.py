from django.urls import path
from .views import EvaluationView

urlpatterns = [

    path('', EvaluationView.as_view()),

]