FROM openjdk:11-jre-slim

EXPOSE 8080

ADD build/distributions/ims-api-boot.tar .
WORKDIR ims-api-boot

CMD ["bin/ims-api"]
