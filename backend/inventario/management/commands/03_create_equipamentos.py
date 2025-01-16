from django.core.management.base import BaseCommand
from faker import Faker
from inventario.models import Equipamento, Site


class Command(BaseCommand):
    help = "Cria registros fake para o modelo Equipamento"

    def add_arguments(self, parser):
        parser.add_argument(
            "quantity",
            type=int,
            help="Quantidade de registros a serem criados",
        )

    def handle(self, *args, **kwargs):
        quantity = kwargs["quantity"]
        fake = Faker("pt_BR")
        sites = list(Site.objects.all())

        for _ in range(quantity):
            Equipamento.objects.create(
                site=fake.random_element(sites),
                codigo=fake.bothify(text="EQP-########"),
                status=fake.boolean(),
                designador=fake.word(),
                tipo=fake.word(),
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"{quantity} registros de Equipamento criados com sucesso!"
            )
        )
