FROM neo4j:3.4.0
# note admin* wildcard below allows "conditional" copy of dump file (only when present)
COPY backup.sh bootstrap_data.sh initial_neo4j-admin*.dump /
RUN chmod +x /backup.sh
