package ca.bc.gov.registries.ppr.imsconnect;

import ca.bc.gov.registries.imsconnect.IMSConnector;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class IMSConnectorFactory {
    @Value("${ims.hostname}")
    private String hostname;
    @Value("${ims.port}")
    private int port;
    @Value("${ims.dataStore}")
    private String dataStore;
    @Value("${ims.username}")
    private String username;
    @Value("${ims.password}")
    private String password;
    @Value("${ims.l_term:}")
    private String lTerm;
    @Value("${ims.client_id_prefix}")
    private String clientIdPrefix;
    @Value("${ims.group:}")
    private String group;
    @Value("${ims.timeout_code:64}")
    private byte timeoutCode;
    @Value("${ims.socket_timeout:30000}")
    private int socketTimeout;

    public IMSConnector createConnection(String transaction) {
        IMSConnector connector = new IMSConnector(hostname, port, dataStore, lTerm, transaction, clientIdPrefix, username, group, password);

        connector.setIMSTimeoutCode(timeoutCode);
        connector.setSocketTimeout(socketTimeout);

        return connector;
    }
}
