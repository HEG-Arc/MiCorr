FROM neo4j:4.0.11
# note admin* wildcard below allows "conditional" copy of dump file (only when present)
COPY backup.sh bootstrap_data.sh initial_neo4j-admin*.dump /
# COPY apoc-3.5.0.15-all.jar /var/lib/neo4j/plugins
COPY apoc-4.0.0.18-all.jar /var/lib/neo4j/plugins
RUN chmod +x /backup.sh
