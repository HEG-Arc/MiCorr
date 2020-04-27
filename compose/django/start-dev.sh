#!/bin/sh
python manage.py migrate
python -Wa manage.py runserver_plus 0.0.0.0:8000
