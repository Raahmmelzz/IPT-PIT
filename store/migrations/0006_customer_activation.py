from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0005_customer_profile_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='is_active',
            # True so existing customers stay logged in
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='customer',
            name='activation_token',
            field=models.CharField(blank=True, default='', max_length=64),
        ),
    ]
