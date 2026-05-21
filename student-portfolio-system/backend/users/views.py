from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["username"] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"] = self.user.role
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["POST"])
def register_view(request):

    username = request.data.get("username", "").strip()
    email = request.data.get("email", "").strip()
    password = request.data.get("password", "")
    password_confirm = request.data.get("password_confirm", "")

    if not username or not email or not password or not password_confirm:
        return Response(
            {"error": "All fields are required."},
            status=400
        )

    if password != password_confirm:
        return Response(
            {"error": "Passwords do not match."},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists."},
            status=400
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists."},
            status=400
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    user.role = "student"
    user.save()

    return Response(
        {"message": "Registration successful."},
        status=201
    )


@api_view(["POST"])
def login_view(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:

        return Response(
            {"error": "Invalid credentials"},
            status=400
        )

    refresh = RefreshToken.for_user(user)
    user_role = user.role

    if user.is_superuser or user.is_staff:
        user_role = "admin"

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": user_role
    })


@api_view(["POST"])
def reset_password_view(request):

    username = request.data.get("username", "").strip()
    email = request.data.get("email", "").strip()
    password = request.data.get("password", "")
    password_confirm = request.data.get("password_confirm", "")

    if not username or not email or not password or not password_confirm:
        return Response({"error": "All fields are required."}, status=400)

    if password != password_confirm:
        return Response({"error": "Passwords do not match."}, status=400)

    try:
        user = User.objects.get(username=username, email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

    user.set_password(password)
    user.save()

    return Response({"message": "Password updated successfully."})