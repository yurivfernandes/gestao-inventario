from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Site
from ..serializers import SiteSerializer


class SiteListCreate(APIView):
    def get(self, request):
        try:
            cliente_id = request.query_params.get("cliente")
            if cliente_id:
                sites = Site.objects.filter(cliente_id=cliente_id)
            else:
                sites = Site.objects.all()

            paginator = Paginator(sites, 50)  # 50 registros por página
            page_number = request.query_params.get("page")
            page_obj = paginator.get_page(page_number)

            serializer = SiteSerializer(page_obj, many=True)
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
                {"error": "Erro ao buscar sites"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        serializer = SiteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SiteUpdate(APIView):
    def put(self, request, pk):
        try:
            site = Site.objects.get(pk=pk)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SiteSerializer(site, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
