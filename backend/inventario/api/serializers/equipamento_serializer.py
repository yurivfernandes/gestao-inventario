from rest_framework import serializers

from ...models import Equipamento


class EquipamentoSerializer(serializers.ModelSerializer):
    site_codigo_vivo = serializers.CharField(
        source="site.codigo_vivo", read_only=True
    )

    class Meta:
        model = Equipamento
        fields = [
            "id",
            "site",
            "codigo",
            "status",
            "designador",
            "tipo",
            "site_codigo_vivo",
        ]
