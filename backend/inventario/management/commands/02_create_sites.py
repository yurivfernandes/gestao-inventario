from django.core.management.base import BaseCommand
from faker import Faker
from inventario.models import Cliente, Site


class Command(BaseCommand):
    help = "Cria registros fake para o modelo Site"

    def add_arguments(self, parser):
        parser.add_argument(
            "quantity",
            type=int,
            help="Quantidade de registros a serem criados",
        )

    def handle(self, *args, **kwargs):
        quantity = kwargs["quantity"]
        fake = Faker("pt_BR")
        clientes = list(Cliente.objects.all())

        for _ in range(quantity):
            Site.objects.create(
                cliente=fake.random_element(clientes),
                cep=fake.postcode(),
                numero=fake.building_number(),
                complemento=fake.text(max_nb_chars=20),  # Alterado aqui
                codigo_sys_cliente=fake.bothify(text="???-########"),
                codigo_vivo=fake.bothify(text="VIVO-########"),
                status=fake.boolean(),
                tipo_site=fake.word(),
                tipo_negocio=fake.word(),
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"{quantity} registros de Site criados com sucesso!"
            )
        )
