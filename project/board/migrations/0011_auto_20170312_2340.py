# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-12 20:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0010_auto_20170312_2331'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board',
            name='created_date',
            field=models.DateTimeField(),
        ),
    ]
