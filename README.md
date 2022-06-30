<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJS Rest API Sample
## About Application
A NestJS RESTful APIs sample project, including:

* Restful APIs to Signup, login (username and password) and getProfile
* Mongoose @nestjs/mongoose module integration 
* Jwt authentication with simple text secrets
* Fully testing codes(Unit test and integration test) with Jest, jest-mock-extended, Super-Test etc.
* Run project using Docker etc.
* The OpenAPI specification using @nestjs/swagger

## Installation

```bash
* Rename .env.example to .env and configure  port, db and JWT settings
* Setup same .env port in to docker-compose.yml file ports 
```

## For docker installation

```bash
$ sudo addgroup --system docker

$ sudo adduser $USER docker

$ newgrp docker

$ sudo snap install docker

To install Docker Compose-V2
$ sudo apt install jq

$ DOCKER_COMPOSE_VERSION=$(curl --silent https://api.github.com/repos/docker/compose/releases/latest | jq .name -r)

$ echo $DOCKER_COMPOSE_VERSION

$ sudo curl -L "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose
```

## Running the app through docker

```bash
# Run project
$ sudo sh compose.sh

# Stop project
$ sudo sh uncompose.sh

```

## Running the app normally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Open api Swagger url
```bash
http://localhost:{APPLICATION_PORT}/api
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Shivang Pandit](https://www.linkedin.com/in/shivang-pandit)

## License

[Nest](https://docs.nestjs.com/support). is [MIT licensed](LICENSE).
