from django.db import models


class Cliente(models.Model):
    vantive_id = models.CharField(max_length=50)
    razao_social = models.CharField(max_length=255)
    codigo = models.CharField(max_length=30)
    status = models.BooleanField()
    cnpj = models.CharField(max_length=14, unique=True)

    class Meta:
        db_table = "d_cliente"
