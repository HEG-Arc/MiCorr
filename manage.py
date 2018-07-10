#!/usr/bin/env python
import os
import sys

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
    # for jupyter notebook use in production
    # we set DATABASE_URL in same way as entrypoint.sh for wsgi.py        
    os.environ.setdefault('DATABASE_URL','postgres://{POSTGRES_USER}:{POSTGRES_PASSWORD}@postgres:5432/{POSTGRES_USER}'.format(
                    POSTGRES_USER=os.environ.get('POSTGRES_USER', 'micorr'),
                    POSTGRES_PASSWORD=os.environ.get('POSTGRES_PASSWORD', '')))
    app_path = os.path.dirname(os.path.abspath(__file__)).replace('/manage.py', '')
    sys.path.append(os.path.join(app_path, 'micorr'))

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
