# FMTOK8S :: GAME User Interface

Simple Game User Interface using a React Application inside a Spring Boot application. 

## Build

First, make sure you have Java 17 installed.

To build the application you can use: 

```
./mvnw package
```

To build the docker image to deploy into a cluster you can run:
(Before building the image make sure that `application.yaml` have the property `spring.web.resources.static-locations` is set to `file:static/`)

```
docker build -t salaboy/fmtok8s-game-frontend:0.1.0 .
docker push salaboy/fmtok8s-game-frontend:0.1.0
```
Replace `salaboy` with your docker hub user or your registry organization.

Unfortunately `./mvnw spring-boot:build-image` goal cannot be used as I do need a custom `Dockerfile`. check the first comments in the `Dockerfile` file.

## Run locally

You can start the React application using `yarn`, without starting the Spring Boot application, which host the API Gateway. 

```
cd frontend/
yarn install //only the first time
yarn start
```

This will start the application in port 8080, so you should be able to access it by pointing your browser to: [`http://localhost:8080`](http://localhost:8080)

For this to work from your laptop/local environment you need to configure the `webpack.dev.config.js` which configure the proxies to connect to the backend services, including the Knative Eventing Broker.

You need to `kubectl port-forward` to the Knative Eventing Broker created inside the cluster, for the local React application to send events to Knative.
You can do that by running this command: 

```
kubectl port-forward svc/broker-ingress -n knative-eventing 8081:80
```




You can also start the Spring Cloud API Gateway with the React Application included by running:
(Before running `spring-boot:run` make sure that `application.properties` have the property `spring.web.resources.static-locations` is set to `file:./target/static/`)
```
mvn spring-boot:run
```

## Deploy into a Kubernetes Cluster with Knative Serving in it

Make sure that you have Knative Serving installed before running: 
```
kubectl apply -f config/
```
