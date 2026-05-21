from django.urls import path
from .views import GeneratePortfolio

urlpatterns = [

    path(
        'generate/',
        GeneratePortfolio.as_view()
    ),

]