from django.core.paginator import Paginator
from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Cliente
from ..serializers import ClienteSerializer


class ClienteListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtém os parâmetros de filtro da URL
        razao_social = request.query_params.get("razao_social")
        cnpj = request.query_params.get("cnpj")
        vantive_id = request.query_params.get("vantive_id")
        codigo = request.query_params.get("codigo")
        status = request.query_params.get("status")

        # Inicia com todos os clientes
        clientes = Cliente.objects.all()

        # Aplica os filtros se fornecidos
        if razao_social:
            clientes = clientes.filter(razao_social__icontains=razao_social)
        if cnpj:
            clientes = clientes.filter(cnpj__icontains=cnpj)
        if codigo:
            clientes = clientes.filter(codigo__icontains=codigo)
        if vantive_id:
            clientes = clientes.filter(vantive_id=vantive_id)
        if (
            status is not None
        ):  # Precisa checar None porque status pode ser False
            clientes = clientes.filter(status=status.lower() == "true")

        paginator = Paginator(clientes, 50)
        page_number = request.query_params.get("page", 1)
        page_obj = paginator.get_page(page_number)

        serializer = ClienteSerializer(page_obj, many=True)
        return Response(
            {
                "count": paginator.count,
                "num_pages": paginator.num_pages,
                "current_page": page_obj.number,
                "results": serializer.data,
            }
        )

    def post(self, request):
        serializer = ClienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClienteUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            cliente = Cliente.objects.get(pk=pk)
        except Cliente.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ClienteSerializer(cliente, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
