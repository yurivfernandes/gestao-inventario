from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Equipamento
from ..serializers import EquipamentoSerializer


class EquipamentoListCreate(APIView):
    def get(self, request):
        try:
            site_id = request.query_params.get("site")
            cliente_id = request.query_params.get("cliente")

            if site_id:
                equipamentos = Equipamento.objects.filter(site_id=site_id)
            elif cliente_id:
                equipamentos = Equipamento.objects.filter(
                    site__cliente_id=cliente_id
                )
            else:
                equipamentos = Equipamento.objects.all()

            serializer = EquipamentoSerializer(equipamentos, many=True)
            return Response(serializer.data)
        except ValidationError as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": "Erro ao buscar equipamentos"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        serializer = EquipamentoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EquipamentoUpdate(APIView):
    def put(self, request, pk):
        try:
            equipamento = Equipamento.objects.get(pk=pk)
        except Equipamento.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = EquipamentoSerializer(equipamento, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
