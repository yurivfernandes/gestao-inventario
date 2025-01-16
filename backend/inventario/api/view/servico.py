from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Servico
from ..serializers import ServicoSerializer


class ServicoListCreate(APIView):
    def get(self, request):
        try:
            equipamento_id = request.query_params.get("equipamento")
            cliente_id = request.query_params.get("cliente")

            if equipamento_id:
                servicos = Servico.objects.filter(
                    equipamento_id=equipamento_id
                )
            elif cliente_id:
                servicos = Servico.objects.filter(
                    equipamento__site__cliente_id=cliente_id
                )
            else:
                servicos = Servico.objects.all()

            paginator = Paginator(servicos, 50)  # 50 registros por página
            page_number = request.query_params.get("page")
            page_obj = paginator.get_page(page_number)

            serializer = ServicoSerializer(page_obj, many=True)
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
                {"error": "Erro ao buscar serviços"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        serializer = ServicoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServicoUpdate(APIView):
    def put(self, request, pk):
        try:
            servico = Servico.objects.get(pk=pk)
        except Servico.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ServicoSerializer(servico, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
