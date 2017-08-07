#!/bin/bash
APP_GIT_REV=$(git describe --tags)
echo "update .env file with MiCorr git revision:"
echo "APP_GIT_REV=$APP_GIT_REV"
sed -i~ .env -e "s/^APP_GIT_REV=.*$/APP_GIT_REV=$APP_GIT_REV/"
grep -q "APP_GIT_REV=value" .env || echo "APP_GIT_REV=$APP_GIT_REV" >> .env
echo "build and start docker-compose production containers"
docker-compose up -d --build
