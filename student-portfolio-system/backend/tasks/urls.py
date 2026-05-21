from django.urls import path
from .views import get_submissions   # ✅ THIS LINE IS REQUIRED

urlpatterns = [
    path("submissions/", get_submissions, name="submissions"),
]