# Generated by Django 4.2.10 on 2025-01-24 17:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0007_remove_cliente_status_vantive'),
    ]

    operations = [
        migrations.AddField(
            model_name='cliente',
            name='status_vantive',
            field=models.CharField(default=1, max_length=50),
            preserve_default=False,
        ),
    ]
