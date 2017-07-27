#!/bin/bash
# Initialize default graph.db with given neo4j-admin dump
if [ -f /initial_neo4j-admin.dump ]; then
   /var/lib/neo4j/bin/neo4j-admin load --from=/initial_neo4j-admin.dump --force
   rm /initial_neo4j-admin.dump
   echo "initial_neo4j-admin.dump loaded and removed from container"
else
   echo "No initial_neo4j-admin.dump found - graph.db is empty/unmodified"
fi
