from django.urls import include, path

from . import view

urlpatterns = [
    path(
        "clientes/",
        view.ClienteListCreate.as_view(),
        name="cliente-list-create",
    ),
    path(
        "clientes/<int:pk>/",
        view.ClienteUpdate.as_view(),
        name="cliente-update",
    ),
    path("sites/", view.SiteListCreate.as_view(), name="site-list-create"),
    path("sites/<int:pk>/", view.SiteUpdate.as_view(), name="site-update"),
    path(
        "equipamentos/",
        view.EquipamentoListCreate.as_view(),
        name="equipamento-list-create",
    ),
    path(
        "equipamentos/<int:pk>/",
        view.EquipamentoUpdate.as_view(),
        name="equipamento-update",
    ),
    path(
        "servicos/",
        view.ServicoListCreate.as_view(),
        name="servico-list-create",
    ),
    path(
        "servicos/<int:pk>/",
        view.ServicoUpdate.as_view(),
        name="servico-update",
    ),
    path(
        "grupos-economicos/",
        view.GrupoEconomicoListCreate.as_view(),
        name="grupo-economico-list-create",
    ),
    path(
        "grupos-economicos/<int:pk>/",
        view.GrupoEconomicoUpdate.as_view(),
        name="grupo-economico-update",
    ),
]
