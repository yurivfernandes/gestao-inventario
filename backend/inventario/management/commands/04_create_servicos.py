from django.core.management.base import BaseCommand
from faker import Faker
from inventario.models import Equipamento, Servico


class Command(BaseCommand):
    help = "Cria registros fake para o modelo Servico"

    def add_arguments(self, parser):
        parser.add_argument(
            "quantity",
            type=int,
            help="Quantidade de registros a serem criados",
        )

    def handle(self, *args, **kwargs):
        quantity = kwargs["quantity"]
        fake = Faker("pt_BR")
        equipamentos = list(Equipamento.objects.all())

        for _ in range(quantity):
            Servico.objects.create(
                equipamento=fake.random_element(equipamentos),
                codigo=fake.bothify(text="SRV-########"),
                status=fake.boolean(),
                designador=fake.word(),
                tipo=fake.word(),
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"{quantity} registros de Servico criados com sucesso!"
            )
        )
