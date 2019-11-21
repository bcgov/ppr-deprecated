package ca.bc.gov.registries.ppr;

import ca.bc.gov.registries.imsconnect.IMSConnector;
import ca.bc.gov.registries.ppr.imsconnect.IMSConnectorFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.commons.lang3.StringUtils.rightPad;

@RestController
@RequestMapping("/search")
public class SearchController {
    private static final String SERIAL_SEARCH_TX = "OLPPTSS";

    private IMSConnectorFactory connectorFactory;

    SearchController(IMSConnectorFactory connectorFactory) {
        this.connectorFactory = connectorFactory;
    }

    @GetMapping
    public Map<String, Object> searchBySerial(@RequestParam(name="serial", required=false) String serial) throws Exception {
        Map<String, Object> response = new HashMap<>();

        // For now, if no serial is provided to search, generate one at random
        String queryValue = isNotBlank(serial) ? serial : randomAlphanumeric(17).toUpperCase();
        response.put("serial", queryValue);

        IMSConnector connector = connectorFactory.createConnection(SERIAL_SEARCH_TX);
        try {
            connector.connect();
            // TODO this request is currently invalid.  Waiting on help to determine the correct contents of the request.
            List<String> results = connector.makeRequest(rightPad(queryValue, 25));
            response.put("results", results);
        } finally {
            connector.disconnect();
        }

        return response;
    }
}
