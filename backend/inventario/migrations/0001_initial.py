# Generated by Django 4.2.10 on 2025-01-15 19:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vantive_id', models.IntegerField()),
                ('razao_social', models.CharField(max_length=255)),
                ('codigo', models.CharField(max_length=30)),
                ('status', models.BooleanField()),
                ('cnpj', models.CharField(max_length=18)),
            ],
            options={
                'db_table': 'd_cliente',
            },
        ),
        migrations.CreateModel(
            name='Equipamento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo', models.CharField(max_length=30)),
                ('status', models.BooleanField()),
                ('designador', models.CharField(max_length=50)),
                ('tipo', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'd_equipamento',
            },
        ),
        migrations.CreateModel(
            name='Site',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cep', models.CharField(max_length=10)),
                ('numero', models.CharField(max_length=10)),
                ('complemento', models.CharField(blank=True, max_length=255, null=True)),
                ('codigo_sys_cliente', models.CharField(max_length=30)),
                ('codigo_vivo', models.CharField(max_length=30)),
                ('status', models.BooleanField()),
                ('tipo_site', models.CharField(max_length=50)),
                ('tipo_negocio', models.CharField(max_length=50)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventario.cliente')),
            ],
            options={
                'db_table': 'd_site',
            },
        ),
        migrations.CreateModel(
            name='Servico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo', models.CharField(max_length=30)),
                ('status', models.BooleanField()),
                ('designador', models.CharField(max_length=50)),
                ('tipo', models.CharField(max_length=50)),
                ('equipamento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventario.equipamento')),
            ],
            options={
                'db_table': 'd_servico',
            },
        ),
        migrations.AddField(
            model_name='equipamento',
            name='site',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventario.site'),
        ),
    ]