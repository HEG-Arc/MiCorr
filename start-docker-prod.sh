#!/bin/bash
if [! -f compose/nginx/dhparams.pem]
then
    openssl dhparam -out compose/nginx/dhparams.pem 2048
fi
APP_GIT_REV=$(git describe --tags)
echo "update .env file with MiCorr git revision:"
echo "APP_GIT_REV=$APP_GIT_REV"

# Parse APP_GIT_REV TAG-NBCOMMIT-gCOMMIT to extract dealer package env vars
EXP_STATEMENT=$(echo $APP_GIT_REV | sed -e 's/\(^.*\)-.*.g\(.*$\)/DEALER_TAG=\1 DEALER_REVISION=\2/')

# echo $EXP_STATEMENT
if [ "$EXP_STATEMENT" == "$APP_GIT_REV" ]
 then
    # git describe result is a tag only (HEAD at tag) so sed did not find pattern
    # and did not modify echo $APP_GIT_REV output
    export DEALER_TAG=$APP_GIT_REV DEALER_REVISION=$APP_GIT_REV
 else
    # sed extracted DEALER_TAG and DEALER_REVISION from APP_GIT_REV
    export $EXP_STATEMENT
 fi
echo DEALER_TAG=$DEALER_TAG
echo DEALER_REVISION=$DEALER_REVISION

# update or create variables in.env file
update_var() {
    sed -i~ .env -e "s/^$1=.*$/$1=$2/"
    grep -q "$1" .env || echo "$1=$2" >> .env
}
update_var APP_GIT_REV $APP_GIT_REV
update_var DEALER_TAG $DEALER_TAG
update_var DEALER_REVISION $DEALER_REVISION
echo "build and start docker-compose production containers"
#docker-compose up -d --build
