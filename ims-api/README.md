# IMS API

The IMS API is a proxy for accessing existing PPR Transactions that were built in the IMS Mainframe.

## Developer Setup

1. Java 11 or above is required to build and run the API
1. You can build the application from the command line with the gradle wrapper: `./gradlew test`

## Application Configuration

Several configuration settings are needed to connect to the mainframe server.  The table below describes the settings
available in this API. See the [Spring Boot Externalized Configuration document](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config)
for the many ways to specify these values, including environment variables.

This system uses [Sentry](https://sentry.io/) for error monitoring.  The minimum prescribed settings are described
below. See the [Java Configuration document](https://docs.sentry.io/clients/java/config/) to see all the available
settings.

| Property Name | Environment Variable | Description |
| ------------- | -------------------- | ----------- |
| ims.hostname | IMS_HOSTNAME | **Required** |
| ims.port | IMS_PORT | **Required** |
| ims.data_store | IMS_DATA_STORE | **Required**, _Max: 8 characters_ |
| ims.username | IMS_USERNAME | **Required**, _Max: 8 characters_ |
| ims.password | IMS_PASSWORD | **Required**, _Max: 8 characters_ |
| ims.l_term | IMS_LTERM | **Required**, _Max: 8 characters_ |
| ims.client_id_prefix | IMS_CLIENT_ID_PREFIX | **Required**.  Will be truncated to 4 characters. |
| ims.group | IMS_GROUP | **Optional**, _Default: `""`_. |
| ims.timeout_code | IMS_TIMEOUT_CODE | **Optional**, _Default 64: (25 seconds), Max: 255_. See [Timeout specifications on input messages](https://www.ibm.com/support/knowledgecenter/en/SSEPH2_13.1.0/com.ibm.ims13.doc.ccg/ims_ct_irmtimerusage.htm). |
| ims.socket_timeout | IMS_SOCKET_TIMEOUT | **Optional**, _Default: 30000_. The socket timeout when calling IMS, in milliseconds. |
| sentry.dns | SENTRY_DSN | **Recommended**. If not specified, Sentry will not receive any notifications from the API. See [Setting the DSN](https://docs.sentry.io/clients/java/config/#setting-the-dsn). |
| sentry.environment | SENTRY_ENVIRONMENT | **Recommended**. See [Environment](https://docs.sentry.io/clients/java/config/#environment). |
