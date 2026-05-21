from django.urls import path
from .views import evaluate_submission

urlpatterns = [

    path(
        "submissions/<int:id>/",
        evaluate_submission
    ),

]