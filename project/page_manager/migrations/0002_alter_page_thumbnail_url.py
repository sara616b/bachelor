# Generated by Django 4.1.7 on 2023-05-09 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('page_manager', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='page',
            name='thumbnail_url',
            field=models.URLField(blank=True, max_length=255),
        ),
    ]