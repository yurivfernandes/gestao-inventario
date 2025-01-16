from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Servico
from ..serializers import ServicoSerializer


class ServicoListCreate(APIView):
    def get(self, request):
        try:
            cliente_id = request.query_params.get("cliente")
            site_id = request.query_params.get("site")
            equipamento_id = request.query_params.get(
                "equipamento"
            )  # Confirmar que está usando "equipamento"

            if not cliente_id:
                return Response(
                    {"error": "Cliente é obrigatório"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Construir a query base
            servicos = Servico.objects.select_related(
                "equipamento", "equipamento__site"
            ).filter(equipamento__site__cliente_id=cliente_id)

            # Debug para verificar os parâmetros recebidos
            print(f"Parâmetros recebidos na API: {request.query_params}")

            # Aplicar filtros em sequência
            if site_id:
                servicos = servicos.filter(equipamento__site_id=site_id)

            if equipamento_id:
                servicos = servicos.filter(equipamento_id=equipamento_id)

            # Aplicar busca se houver
            search = request.query_params.get("search")
            if search:
                servicos = servicos.filter(
                    Q(designador__icontains=search)
                    | Q(codigo__icontains=search)
                )

            # Debug dos filtros
            print(f"Query SQL: {servicos.query}")
            print(f"Total de serviços encontrados: {servicos.count()}")
            print(
                f"Parâmetros: cliente={cliente_id}, site={site_id}, equipamento={equipamento_id}"
            )

            # Paginação dos resultados
            paginator = Paginator(servicos.distinct(), 50)
            page_number = request.query_params.get("page", 1)
            page_obj = paginator.get_page(page_number)

            serializer = ServicoSerializer(page_obj, many=True)
            return Response(
                {
                    "count": paginator.count,
                    "num_pages": paginator.num_pages,
                    "current_page": page_obj.number,
                    "results": serializer.data,
                    "filters_applied": {
                        "cliente": cliente_id,
                        "site": site_id,
                        "equipamento": equipamento_id,
                        "search": search,
                    },
                }
            )

        except ValidationError as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Erro ao buscar serviços: {str(e)}")  # Debug
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
