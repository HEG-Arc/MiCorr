FROM python:2.7
ENV PYTHONUNBUFFERED 1

RUN groupadd -r django \
    && useradd -r -g django django -m -d /home/django -s /bin/bash

# Requirements have to be pulled and installed here, otherwise caching won't work
COPY ./requirements /requirements
RUN pip install --no-cache-dir -r /requirements/production.freeze \
    && rm -rf /requirements

# patch wagtail migration for migration compatibilty
# see https://code.micorr.org/youtrack/issue/MC-277#comment=4-151
RUN sed -i -e 's/0026_group_collection_permission/0002_initial_data/' $(find  /usr/local/lib/ -name 0001_create_admin_access_permissions.py)

COPY ./compose/django/gunicorn.sh ./compose/django/entrypoint.sh /
RUN sed -i 's/\r//' /entrypoint.sh \
    && sed -i 's/\r//' /gunicorn.sh \
    && chmod +x /entrypoint.sh \
    && chown django /entrypoint.sh \
    && chmod +x /gunicorn.sh \
    && chown django /gunicorn.sh

COPY . /app

RUN chown -R django /app

USER django

WORKDIR /app

ENTRYPOINT ["/entrypoint.sh"]
