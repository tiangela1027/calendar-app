# Generated by Django 3.2.6 on 2021-08-22 04:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cal', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='completed',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='task',
            name='description',
            field=models.CharField(default='', max_length=200),
            preserve_default=False,
        ),
    ]
