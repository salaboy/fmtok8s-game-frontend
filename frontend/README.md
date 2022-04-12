# From Monolith to K8s - FrontEnd
This project contains a new user interface based on React for the Conference Platform defined in [From Monolith to K8s](http://github.com/salaboy/from-monolith-to-k8s)


## Build Container

Before building the Docker image, check that the `application.properties` file has the following property and value: 
```
spring:
  web:
    resources:
      static-locations: "file:static/"
```

Then build with Maven and use docker build + push: 

```
mvn package
docker build -t <USERNAME>/fmtok8s-game-frontend:0.1.0 .
docker push <USERNAME>/fmtok8s-game-frontend:0.1.0
```

Unfortunately: `mvn spring-boot:build-image` doesn't work on this project, because we need to copy the front end files into the container, as we are doing it in the Dockerfile.

Then tag and push:
```
docker tag fmtok8s-game-frontend:0.0.1-SNAPSHOT salaboy/fmtok8s-game-frontend:0.1.0
docker push salaboy/fmtok8s-game-frontend:0.1.0

```

## Run

There are three ways of running the front end: 

If you just want to start the React Application you
From the `frontend/` directory, to start this project:

`yarn install`
`yarn start`
