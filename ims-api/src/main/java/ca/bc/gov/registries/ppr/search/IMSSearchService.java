package ca.bc.gov.registries.ppr.search;

import ca.bc.gov.registries.imsconnect.IMSConnector;
import ca.bc.gov.registries.ppr.imsconnect.IMSConnectorFactory;
import org.springframework.stereotype.Component;

import java.util.List;

import static org.apache.commons.lang3.StringUtils.rightPad;

@Component
public class IMSSearchService implements ISearchService {
    private static final String SERIAL_SEARCH_TX = "OLPPTSS";

    private IMSConnectorFactory connectorFactory;

    IMSSearchService(IMSConnectorFactory connectorFactory) {
        this.connectorFactory = connectorFactory;
    }

    @Override
    public List<String> findFinancialStatementsBySerial(String serial) throws Exception {
        IMSConnector connector = connectorFactory.createConnection(SERIAL_SEARCH_TX);
        try {
            connector.connect();
            // TODO this request is currently invalid.  Waiting on help to determine the correct contents of the request.
            List<String> results = connector.makeRequest(rightPad(serial, 25));
            return results;
        } finally {
            connector.disconnect();
        }
    }
}
