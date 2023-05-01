#!/bin/bash

echo "Running flake8"
flake8

echo "Runing yamllint on docker-compose"
yamllint docker-compose.yml

echo "Running prettier check"
npx prettier --check .
