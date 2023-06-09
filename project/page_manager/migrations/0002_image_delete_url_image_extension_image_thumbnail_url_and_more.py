# Generated by Django 4.1.7 on 2023-05-06 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('page_manager', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='delete_url',
            field=models.URLField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='image',
            name='extension',
            field=models.CharField(default='', max_length=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='image',
            name='thumbnail_url',
            field=models.URLField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='page',
            name='thumbnail_url',
            field=models.URLField(blank=True, max_length=255),
        ),
    ]
