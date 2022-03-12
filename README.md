# FMTOK8S :: GAME User Interface
Simple Game User Interface using a React Application inside a Spring Boot application. 

## Build

To build the application you can use: 

```
mvn package
```

To build the docker image to deploy into a cluster you can run: 

```
mvn spring-boot:build-image
```

Now to push the docker image to a registry (probably docker hub is you have and account and already did `docker login`) you can run:

```
docker tag fmtok8s-game-ui salaboy/fmtok8s-game-ui:0.1.0 
docker push salaboy/fmtok8s-game-ui:0.1.0
```

## Run locally

You can start the React application using `yarn`, without starting the Spring Boot application, which host the API Gateway. 

```
cd frontend/
yarn install //only the first time
yarn start
```

This will start the application in port 8080, so you should be able to access it by pointing your browser to: [`http://localhost:8080`](http://localhost:8080)

For this to work from your laptop/local environment you need to configure the `webpack.dev.config.js` which configure the proxies to connect to the backend services, including the Knative Eventing Broker.

## Deploy into a Kubernetes Cluster with Knative Serving in it

Make sure that you have Knative Serving installed before running: 
```
kubectl apply -f config/
```