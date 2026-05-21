from django.urls import path
from .views import teacher_login, teacher_register, teacher_password_reset

urlpatterns = [

    path(
        'teacher-login/',
        teacher_login,
        name='teacher-login'
    ),

    path(
        'teacher-register/',
        teacher_register,
        name='teacher-register'
    ),

    path(
        'teacher-password-reset/',
        teacher_password_reset,
        name='teacher-password-reset'
    ),

]