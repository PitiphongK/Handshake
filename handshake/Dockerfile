FROM python:3.11-slim-bookworm

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./handshake .

RUN python manage.py collectstatic --noinput


ENV DJANGO_SETTINGS_MODULE=handshake.settings
ENV DEBUG=False

EXPOSE 8000

CMD gunicorn handshake.wsgi:application --bind 0.0.0.0:8000 --workers 4 --threads 2 