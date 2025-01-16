from django.db import models

from .equipamento import Equipamento


class Servico(models.Model):
    equipamento = models.ForeignKey(Equipamento, on_delete=models.CASCADE)
    codigo = models.CharField(max_length=30)
    status = models.BooleanField()
    designador = models.CharField(max_length=50)
    tipo = models.CharField(max_length=50)

    class Meta:
        db_table = "d_servico"
