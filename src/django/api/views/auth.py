from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from dj_rest_auth.views import LoginView, LogoutView

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from ..serializers import UserSerializer


class Login(LoginView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if email is None or password is None:
            raise AuthenticationFailed("Email and password are required")

        user = authenticate(email=email, password=password)

        if user is None:
            raise AuthenticationFailed("Unable to login with those credentials")
        if user.has_admin_generated_password:
            context = {
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': default_token_generator.make_token(user),
            }
            # Ask client to redirect to a password reset link
            return Response(context, status=status.HTTP_302_FOUND)

        login(request, user)

        return Response(UserSerializer(user).data)

    def get(self, request, *args, **kwargs):
        if not request.user.is_active:
            raise AuthenticationFailed("Unable to sign in")

        return Response(UserSerializer(request.user).data)


class Logout(LogoutView):
    def post(self, request, *args, **kwargs):
        logout(request)

        return Response(status=status.HTTP_204_NO_CONTENT)
