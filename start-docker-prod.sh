#!/bin/bash
if  [ ! -f ./compose/nginx/dhparams.pem ]
then
    openssl dhparam -out compose/nginx/dhparams.pem 2048
fi

export APP_GIT_REV=$(git describe --tags)
export APP_GIT_COMMIT=$(git rev-parse --short HEAD)

export DEALER_TAG=$APP_GIT_REV # DEALER_TAG will show full describe version information in app (ie v1.0-5-ge1e7100)
export DEALER_REVISION=$APP_GIT_COMMIT # DEALER_REVISION will allow to link to commit on github

echo "update .env file with MiCorr git revision:"
echo "APP_GIT_REV=$APP_GIT_REV"
echo "DEALER_TAG=$DEALER_TAG"
echo "DEALER_REVISION=$DEALER_REVISION"

# update or create variables in.env file
update_var() {
    sed -i~ .env -e "s/^$1=.*$/$1=$2/"
    grep -q "$1" .env || echo "$1=$2" >> .env
}
update_var APP_GIT_REV $APP_GIT_REV
update_var DEALER_TAG $DEALER_TAG
update_var DEALER_REVISION $DEALER_REVISION
echo "build and start docker-compose production containers"
docker-compose up -d --build
