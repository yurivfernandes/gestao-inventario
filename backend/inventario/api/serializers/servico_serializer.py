from rest_framework import serializers

from ...models import Servico


class ServicoSerializer(serializers.ModelSerializer):
    equipamento_codigo = serializers.CharField(
        source="equipamento.codigo", read_only=True
    )
    site_codigo_vivo = serializers.CharField(
        source="equipamento.site.codigo_vivo", read_only=True
    )

    class Meta:
        model = Servico
        fields = [
            "id",
            "equipamento",
            "codigo",
            "status",
            "designador",
            "tipo",
            "equipamento_codigo",
            "site_codigo_vivo",
        ]
