# Generated by Django 3.2.13 on 2022-09-29 13:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_create_annotation'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='has_admin_generated_password',
            field=models.BooleanField(default=True),
        ),
    ]
