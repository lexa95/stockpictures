# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-12 20:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0009_auto_20170309_1538'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board',
            name='identification',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
