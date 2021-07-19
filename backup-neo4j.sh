./maintenance-on.sh
docker-compose stop django
docker-compose stop neo4j
docker-compose run --rm --entrypoint='bash -c "source /backup.sh"' neo4j
docker-compose up -d neo4j django
# wait for django  to be ready (collect-static exec)
sleep 120
./maintenance-off.sh
