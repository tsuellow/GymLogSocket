# GymLogSocket

## Docker

### Build

`docker build . -t andresabadia/gymlog-socket`

### Run

    docker run --name gymlog-socket-container --rm -d andresabadia/gymlog-socket

### Run with compose

`docker-compose up -d`

### Update Docker

- Stop running container: `docker-compose down` or `docker stop <container_id>` get running container with `docker ps`

- remove stoped containers: `docker container purge`

- remove image: `docker rmi <image_id>` get image id from `docker images -a`

- run image again
