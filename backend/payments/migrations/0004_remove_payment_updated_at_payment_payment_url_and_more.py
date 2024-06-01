# Generated by Django 5.0.6 on 2024-06-01 05:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0003_apikey'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payment',
            name='updated_at',
        ),
        migrations.AddField(
            model_name='payment',
            name='payment_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='payment',
            name='qr_code',
            field=models.ImageField(blank=True, null=True, upload_to='qr_codes/'),
        ),
    ]