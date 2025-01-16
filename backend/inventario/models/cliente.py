from django.db import models

class Cliente(models.Model):
    vantive_id = models.IntegerField()
    razao_social = models.CharField(max_length=255)
    codigo = models.CharField(max_length=30)
    status = models.BooleanField()
    cnpj = models.CharField(max_length=18)

    class Meta:
        db_table = 'd_cliente'