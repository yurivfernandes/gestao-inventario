from django.db import models

from .site import Site


class Equipamento(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    codigo = models.CharField(max_length=30)
    status = models.BooleanField()
    designador = models.CharField(max_length=50)
    tipo = models.CharField(max_length=50)

    class Meta:
        db_table = "d_equipamento"
