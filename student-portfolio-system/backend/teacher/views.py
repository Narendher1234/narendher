from django.shortcuts import render
from django.contrib.auth.hashers import check_password, make_password

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Teacher


@api_view(['POST'])
def teacher_login(request):

    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")

    if not username or not password:
        return Response({"error": "Username and password are required."}, status=400)

    try:
        teacher = Teacher.objects.get(username=username)

        if not check_password(password, teacher.password):
            raise Teacher.DoesNotExist

        return Response({
            "message": "Login Success",
            "id": teacher.id,
            "username": teacher.username,
            "role": teacher.role
        })

    except Teacher.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=401)


@api_view(['POST'])
def teacher_register(request):

    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")
    password_confirm = request.data.get("password_confirm", "")

    if not username or not password or not password_confirm:
        return Response({"error": "All fields are required."}, status=400)

    if password != password_confirm:
        return Response({"error": "Passwords do not match."}, status=400)

    if Teacher.objects.filter(username=username).exists():
        return Response({"error": "Username already exists."}, status=400)

    Teacher.objects.create(username=username, password=make_password(password))

    return Response({"message": "Teacher account created successfully."}, status=201)


@api_view(['POST'])
def teacher_password_reset(request):

    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")
    password_confirm = request.data.get("password_confirm", "")

    if not username or not password or not password_confirm:
        return Response({"error": "All fields are required."}, status=400)

    if password != password_confirm:
        return Response({"error": "Passwords do not match."}, status=400)

    try:
        teacher = Teacher.objects.get(username=username)
        teacher.password = make_password(password)
        teacher.save()
        return Response({"message": "Password reset successful."})
    except Teacher.DoesNotExist:
        return Response({"error": "Teacher not found."}, status=404)
