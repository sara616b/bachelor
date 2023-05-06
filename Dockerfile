FROM python:3.10-alpine

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN apk add python3-dev postgresql-client postgresql-dev musl-dev build-base nodejs npm

COPY . /app

WORKDIR /app

RUN npm install

RUN pip install -r /app/requirements.txt

WORKDIR /app/project
