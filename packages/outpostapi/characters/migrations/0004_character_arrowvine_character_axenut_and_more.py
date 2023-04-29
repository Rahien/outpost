# Generated by Django 4.2 on 2023-04-29 15:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('characters', '0003_rename_user_id_character_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='character',
            name='arrowvine',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='character',
            name='axenut',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='character',
            name='corpsecap',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='character',
            name='flamefruit',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='character',
            name='gold',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='character',
            name='hide',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='character',
            name='metal',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='character',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='character',
            name='perk_tags',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='character',
            name='rockroot',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='character',
            name='snowthistle',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='character',
            name='wood',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='character',
            name='xp',
            field=models.IntegerField(default=0),
        ),
    ]
