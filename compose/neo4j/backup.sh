#!/usr/bin/env bash
BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
echo "neo4j-admin dump to: /data/graphdb_${BACKUP_DATE}.dump"
/var/lib/neo4j/bin/neo4j-admin dump --database=graph.db --to=/data/graphdb_${BACKUP_DATE}.dump

