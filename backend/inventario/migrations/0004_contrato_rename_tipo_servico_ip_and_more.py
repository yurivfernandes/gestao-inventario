# Generated by Django 4.2.10 on 2025-01-24 13:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0003_cliente_grupo_economico_cliente_status_vantive'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contrato',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sku', models.CharField(max_length=100)),
                ('data_registro', models.DateField()),
                ('data_inicio', models.DateField()),
                ('data_fim', models.DateField()),
                ('status', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Contrato',
                'verbose_name_plural': 'Contratos',
                'db_table': 'd_contrato',
            },
        ),
        migrations.RenameField(
            model_name='servico',
            old_name='tipo',
            new_name='ip',
        ),
        migrations.RemoveField(
            model_name='equipamento',
            name='codigo',
        ),
        migrations.RemoveField(
            model_name='equipamento',
            name='designador',
        ),
        migrations.RemoveField(
            model_name='servico',
            name='codigo',
        ),
        migrations.AddField(
            model_name='equipamento',
            name='fornecedor',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='equipamento',
            name='hw_end_life_cycle',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='equipamento',
            name='hw_end_support',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='equipamento',
            name='modelo',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='equipamento',
            name='redundancia',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='equipamento',
            name='serial_number',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='equipamento',
            name='sw_end_life_cycle',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='equipamento',
            name='sw_end_support',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='servico',
            name='oferta',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='servico',
            name='operadora',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='servico',
            name='pacote',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='servico',
            name='ra',
            field=models.CharField(default=1, max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='servico',
            name='redundancia',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='servico',
            name='servico_num',
            field=models.CharField(default=1, max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='servico',
            name='status',
            field=models.BooleanField(default=True),
        ),
        migrations.CreateModel(
            name='Link',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('operadora', models.CharField(max_length=100)),
                ('designador', models.CharField(max_length=100)),
                ('equipamento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventario.equipamento')),
            ],
            options={
                'verbose_name': 'Link',
                'verbose_name_plural': 'Links',
                'db_table': 'd_link',
            },
        ),
        migrations.CreateModel(
            name='Licenca',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('licenca_numero', models.CharField(max_length=100)),
                ('contrato', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventario.contrato')),
            ],
            options={
                'verbose_name': 'Licença',
                'verbose_name_plural': 'Licenças',
                'db_table': 'd_licenca',
            },
        ),
        migrations.AddField(
            model_name='contrato',
            name='equipamento',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventario.equipamento'),
        ),
    ]