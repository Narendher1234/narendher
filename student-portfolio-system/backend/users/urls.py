from django.urls import path
from .views import login_view, register_view, reset_password_view

urlpatterns = [
    path("login/", login_view),
    path("register/", register_view),
    path("password-reset/student/", reset_password_view),
]