# ...existing code...

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # Certifique-se que está antes do CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    # ...outros middlewares...
    "access.middleware.DocsSameOriginMiddleware",  # Adicione por último
]

# Adicione estas configurações
X_FRAME_OPTIONS = "SAMEORIGIN"
CORS_ALLOW_ALL_ORIGINS = True  # Em desenvolvimento
CORS_ALLOW_CREDENTIALS = True
