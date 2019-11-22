# IMS API

The IMS API is a proxy for accessing existing PPR Transactions that were built in the IMS Mainframe.

## Developer Setup

1. Java 11 or above is required to build and run the API
1. You can build the application from the command line with the gradle wrapper: `./gradlew test`

## Application Configuration

Several configuration settings are needed to connect to the mainframe server.  The table below describes the settings
available in this API.  See https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config
for the many ways to specify these values, including environment variables.

| Property Name | Description |
| -------- | ----------- |
| ims.hostname | **Required** |
| ims.port | **Required** |
| ims.dataStore | **Required**, _Max: 8 characters_ |
| ims.username | **Required**, _Max: 8 characters_ |
| ims.password | **Required**, _Max: 8 characters_ |
| ims.l_term | **Required**, _Max: 8 characters_ |
| ims.client_id_prefix | **Required**.  Will be truncated to 4 characters. |
| ims.group | **Optional**, _Default: `""`_. |
| ims.timeout_code | **Optional**, _Default 64: (25 seconds), Max: 255_. See [Timeout specifications on input messages](https://www.ibm.com/support/knowledgecenter/en/SSEPH2_13.1.0/com.ibm.ims13.doc.ccg/ims_ct_irmtimerusage.htm). |
| ims.socket_timeout | **Optional**, _Default: 30000_. The socket timeout when calling IMS, in milliseconds. |
