from django.urls import include, path
from inventario.api.view.cliente import ClienteListCreate, ClienteUpdate
from inventario.api.view.equipamento import (
    EquipamentoListCreate,
    EquipamentoUpdate,
)
from inventario.api.view.servico import ServicoListCreate, ServicoUpdate
from inventario.api.view.site import SiteListCreate, SiteUpdate

urlpatterns = [
    path("clientes/", ClienteListCreate.as_view(), name="cliente-list-create"),
    path("clientes/<int:pk>/", ClienteUpdate.as_view(), name="cliente-update"),
    path("sites/", SiteListCreate.as_view(), name="site-list-create"),
    path("sites/<int:pk>/", SiteUpdate.as_view(), name="site-update"),
    path(
        "equipamentos/",
        EquipamentoListCreate.as_view(),
        name="equipamento-list-create",
    ),
    path(
        "equipamentos/<int:pk>/",
        EquipamentoUpdate.as_view(),
        name="equipamento-update",
    ),
    path("servicos/", ServicoListCreate.as_view(), name="servico-list-create"),
    path("servicos/<int:pk>/", ServicoUpdate.as_view(), name="servico-update"),
]
