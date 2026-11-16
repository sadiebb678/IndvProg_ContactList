#!/usr/bin/env bash
set -e

source /var/app/venv/*/bin/activate

python /var/app/current/manage.py collectstatic --noinput
python /var/app/current/manage.py migrate --noinput
