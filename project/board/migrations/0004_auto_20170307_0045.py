# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-06 21:45
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('board', '0003_auto_20170306_2308'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='subscription',
            unique_together=set([('user', 'board')]),
        ),
    ]
