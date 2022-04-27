## There are two reasons why I added a Dockerfile here:
##  1) I need to copy more assets into specific locations for the container image to find static resources (I have the feeling that this can be done with a maven plugin)
##  2) For Feature flags in the UI I am using the startup.sh script which create a file based on the docker env variables present at startup time
FROM eclipse-temurin:17-jre
ENV PORT 8080
ENV CLASSPATH /opt/lib
EXPOSE 8080

# copy pom.xml and wildcards to avoid this command failing if there's no target/lib directory
COPY pom.xml target/lib* /opt/lib/

# NOTE we assume there's only 1 jar in the target dir
# but at least this means we don't have to guess the name
# we could do with a better way to know the name - or to always create an app.jar or something
COPY target/*.jar /opt/app.jar
COPY target/static/* /opt/static/
COPY target/static/images/* /opt/static/images/

WORKDIR /opt

ENTRYPOINT ["java", "-jar", "app.jar"]
