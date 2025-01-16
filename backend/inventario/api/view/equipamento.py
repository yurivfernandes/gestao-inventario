from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Equipamento
from ..serializers import EquipamentoSerializer


class EquipamentoListCreate(APIView):
    def get(self, request):
        try:
            cliente_id = request.query_params.get("cliente")
            site_id = request.query_params.get("site")

            if not cliente_id:
                return Response(
                    {"error": "Cliente é obrigatório"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            equipamentos = Equipamento.objects.filter(
                site__cliente_id=cliente_id
            )

            if site_id:
                equipamentos = equipamentos.filter(site_id=site_id)

            search = request.query_params.get("search")
            if search:
                equipamentos = equipamentos.filter(
                    Q(designador__icontains=search)
                    | Q(codigo__icontains=search)
                )

            paginator = Paginator(equipamentos, 50)  # 50 registros por página
            page_number = request.query_params.get("page")
            page_obj = paginator.get_page(page_number)

            serializer = EquipamentoSerializer(page_obj, many=True)
            return Response(
                {
                    "count": paginator.count,
                    "num_pages": paginator.num_pages,
                    "current_page": page_obj.number,
                    "results": serializer.data,
                }
            )
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
