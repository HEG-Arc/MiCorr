#!/usr/bin/env python
import os
import sys

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')

    app_path = os.path.dirname(os.path.abspath(__file__)).replace('/manage.py', '')
    sys.path.append(os.path.join(app_path, 'micorr'))

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
