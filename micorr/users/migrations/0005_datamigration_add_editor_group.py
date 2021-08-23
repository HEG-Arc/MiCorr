# Generated by Django 3.0.7 on 2021-06-01 15:58

from django.db import migrations



def add_admin_groups(apps, schema_editor):
    Group = apps.get_model('auth.Group')
    Permission = apps.get_model('auth.Permission')

    micorr_editors, created = Group.objects.get_or_create(name='MiCorr Editors')
    for m in ['RecoveringDate', 'CorrosionType', 'CorrosionForm', 'Element', 'Contact', 'Origin']:
        micorr_editors.permissions.add(Permission.objects.get(codename=f'add_{m.lower()}'))


def remove_admin_groups(apps, schema_editor):
    Group = apps.get_model('auth.Group')
    Group.objects.filter(name='MiCorr Editors').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_django2_lastname_and_username'),
    ]

    operations = [
        migrations.RunPython(add_admin_groups, remove_admin_groups)
    ]