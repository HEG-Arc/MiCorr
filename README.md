## TO START MICORR IN LOCAL MODE

**FIRST STEP TO ENSURE GOOD EOL CHARACTERS FOR GIT**

On windows 10:

*Modify the global gitconfig file*

1. Go to your gitconfig file:
`C:\Users\<username>\.gitconfig`

2. Open it with notepad++ and add the following options:
```
[core]
    eol = lf
    autocrlf = false
```
3. Save file and exit.

*Modify the system gitconfig file*

1. Go to your gitconfig file:
<git-install-root>\mingw64\etc\gitconfig

2. Open it with notepad++ as administrator and add the following options:
```
[core]
    eol = lf
    autocrlf = false
```

3. Save file and exit


**PULL THE MICORR PROJECT FROM THE GIT REPOSITORY**

Actual adress of MiCorr git repository
https://github.com/HEG-Arc/MiCorr.git

**SET THE DOCKER COMPOSE FILE FOR DEV VERSION**

*Those steps shall always be done when you enter in your project*

1. Set the var for the docker compose file:
```shell script
source local.sh
```
2. Verify that the compose file is properly set up:
```shell script
echo $COMPOSE_FILE
```
That command should output the following in the terminal:

	`dev.yml`

**TO BUILD YOUR MICORR PROJECT**

1. Create new .env file from env.example into project root:
```sh
cp env.example .env
```

2. Cleanup of everything (containers, volumes and networks) to start a clean project:

*DO NOT USE THIS COMMAND IF YOU WANT TO KEEP THE DATAS IN YOUR DATABASES*

```shell script
docker-compose down --rmi all -v --remove-orphans
```

3. Add the postgres password into the dev.yml file:
 - Open .env file and search for `POSTGRES_PASSWORD` variable
 - Add to dev.yml into services under the postgres container the environment variable `- POSTGRES_PASSWORD=mysecretpass` as follow:
```yaml
services:
  postgres:
    build: ./compose/postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./data/psql-backup:/backups
    environment:
      - POSTGRES_USER=micorr
      - POSTGRES_PASSWORD=mysecretpass    # <= THIS IS WHERE YOU MUST ADD THE VALUE
    ports:
      - "5432:5432"
```

4. Build and start your containers with the following shell command:
```shell script
docker-compose up -d
```

- ALTERNATIVE (to use only if the code of the containers has been changed):

Force the build of your containers before starting them with the following shell command:

```shell script
docker-compose up -d --build
```

5. Verify that all your containers are up and running:
```Shell script
docker ps
```
This command shall output a similar list (the names and ports of the containers should be the same):
```shell script
CONTAINER ID   IMAGE                        ...   STATUS          PORTS                                                                                            NAMES
eaf1a1d62287   81bc6fbcaf09                 ...   Up 55 minutes   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp                                                        micorr_node_1
8852aac1d306   efeea1848592                 ...   Up 55 minutes   0.0.0.0:7474->7474/tcp, :::7474->7474/tcp, 7473/tcp, 0.0.0.0:7687->7687/tcp, :::7687->7687/tcp   micorr_neo4j_1
4a4cc9b23f0e   d8dc93872711                 ...   Up 55 minutes   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp                                                        micorr_postgres_1
7129958fc202   9ebd8a2d29ba                 ...   Up 2 seconds    0.0.0.0:8000->8000/tcp, :::8000->8000/tcp                                                        micorr_django_1
153bc1d7e39d   blacktop/elasticsearch:2.4   ...   Up 55 minutes   0.0.0.0:9200->9200/tcp, :::9200->9200/tcp, 9300/tcp                                              micorr_elast
```
If one container is not running, you can start it with the following command:
``` shell script
docker compose start <container name>
```
If the container is not starting after this command, restart from step 4: Cleanup of everything.

6. Copy the all the backups into your root:
``` shell script
backup_2021_07_15T13_58_16.sql
micorr-media-2021-07-15.tar.gz
graphdb_20210715_152917.dump
```

7. Stop django container:
```shell script
docker compose stop django
```

8. Copy the postgres backup into the volume of postgres `./data/psql-backup/`:
```shell script
cp backup_2021_07_15T13_58_16.sql ./data/psql-backup/backup_2021_07_15T13_58_16.sql
```
Check that the backup is present in the postgres container with:

```shell script
docker compose exec postgres list-backups
```
The command shall return a list as the following one with the name of the backup `backup_2021_07_15T13_58_16.sql` present:

```shell script
listing available backups
-------------------------
backup_2021_07_15T13_58_16.sql  backup_2021_07_15T15_19_44.sql
```

9. De-tar the media archive:
```shell script
tar -xzvf micorr-media-2021-07-15.tar.gz
```

A `media` directory at `./micorr/media` was created with all the resources inside the `.tar` file.

10. Restore the postgres db with the backup:
```shell script
docker compose exec postgres restore backup_2021_07_15T13_58_16.sql
```


11. Stop the neo4j container
```shell script
docker compose stop neo4j
```

12. Copy the no4j initial data dump into the neo4j compose files:
```shell script
cp graphdb_20210715_152917.dump compose/neo4j/initial_neo4j-admin.dump
```
The neo4j db dockerfile  will copy the file named `initial_neo4j-admin.dump` into the neo4j container and the script `bootstrap_data.sh` will initialize the neo4j db with the content of `initial_neo4j-admin.dump`.

13. Rebuild the neo4j container
```shell script
docker compose build neo4j
```
The terminal shall indicate the copy of `initial_neo4j-admin.dump` into the neo4j container:
 ```shell script
[+] Building 5.8s (10/10) FINISHED
...
 => [1/4] FROM docker.io/library/neo4j:4.0.11@sha256:2b8d71eb2e6e6e162a723c733c1c6a27a62c54774108523a5a4c15cf9aa55c19   0.0s
 => [internal] load build context                                                                                       1.0s
 => => transferring context: 26.08MB                                                                                    1.0s
 => CACHED [2/4] COPY backup.sh bootstrap_data.sh initial_neo4j-admin*.dump /                                           0.0s
 => CACHED [3/4] COPY apoc-4.0.0.18-all.jar /var/lib/neo4j/plugins                                                      0.0s
 => CACHED [4/4] RUN chmod +x /backup.sh                                                                                0.0s
...
```

14. Rename the `initial_neo4j-admin.dump` from the `compose/neo4j/` directory into `no_initial_neo4j-admin.dump` to prevent the rewrite of neo4j db contents at container startup
```shell script
mv compose/neo4j/initial_neo4j-admin.dump compose/neo4j/no_initial_neo4j-admin.dump
```
15. Restart all containers with
```shell script
docker compose up -d
```
