# Generated by Django 3.2.13 on 2022-10-13 15:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_add_other_states'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='submission',
            options={'get_latest_by': 'created_at'},
        ),
        migrations.AlterField(
            model_name='annotation',
            name='review',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='annotations', to='api.review'),
        ),
        migrations.AlterField(
            model_name='approval',
            name='submission',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='approval', to='api.submission'),
        ),
        migrations.AlterField(
            model_name='review',
            name='submission',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='review', to='api.submission'),
        ),
        migrations.AlterField(
            model_name='submission',
            name='boundary',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='submissions', to='api.boundary'),
        ),
    ]
