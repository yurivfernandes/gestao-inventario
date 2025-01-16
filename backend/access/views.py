import json

from django.contrib.auth import authenticate, get_user_model, login
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .forms import CustomUserCreationForm

User = get_user_model()


def signup(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")
            raw_password = form.cleaned_data.get("password1")
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect("home")
    else:
        form = CustomUserCreationForm()
    return render(request, "signup.html", {"form": form})


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])  # Permite acesso sem autenticação
def api_login(request):
    data = request.data
    username = data.get("username")
    password = data.get("password")

    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "user_id": user.id, "username": user.username}
        )
    return Response(
        {"error": "Credenciais inválidas"}, status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET"])
def check_username(request, username):
    is_available = not User.objects.filter(username=username).exists()
    return Response({"available": is_available})


@csrf_exempt
@api_view(["POST", "OPTIONS"])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method == "OPTIONS":
        response = Response()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = (
            "Content-Type, Authorization"
        )
        return response

    user = request.user
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")

    if not user.check_password(current_password):
        response = Response({"message": "Senha atual incorreta"}, status=400)
        response["Access-Control-Allow-Origin"] = "*"
        return response

    try:
        validate_password(new_password)
    except ValidationError as e:
        response = Response({"message": str(e)}, status=400)
        response["Access-Control-Allow-Origin"] = "*"
        return response

    user.set_password(new_password)
    user.save()

    response = Response({"message": "Senha alterada com sucesso"}, status=200)
    response["Access-Control-Allow-Origin"] = "*"
    return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    data = {
        "username": user.username,
        "full_name": user.full_name,
    }
    return Response(data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def profile_update(request):
    user = request.user
    try:
        for field in ["full_name", "phone", "company_name", "cep"]:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()
        return Response({"message": "Perfil atualizado com sucesso"})
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )
