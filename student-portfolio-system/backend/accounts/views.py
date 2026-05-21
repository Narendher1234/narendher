from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["POST"])
def login_user(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    print("DEBUG USER:", user)

    if user:
        return Response({
            "username": user.username,
            "role": getattr(user, "role", "student"),
            "is_staff": user.is_staff
        })

    return Response({"error": "Invalid username or password"}, status=400)