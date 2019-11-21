package ca.bc.gov.registries.ppr;

import ca.bc.gov.registries.imsconnect.IMSConnector;
import ca.bc.gov.registries.ppr.imsconnect.IMSConnectorFactory;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.apache.commons.lang3.StringUtils.rightPad;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class SearchControllerTest {
    private SearchController controller;

    private IMSConnectorFactory mockConnectorFactory;
    private IMSConnector mockConnector;

    @Before
    public void setUp() {
        mockConnector = mock(IMSConnector.class);
        mockConnectorFactory = mock(IMSConnectorFactory.class);
        when(mockConnectorFactory.createConnection(anyString())).thenReturn(mockConnector);

        controller = new SearchController(mockConnectorFactory);
    }

    @Test
    public void searchSerial_ShouldPadInputTo25Characters() throws Exception {
        String serial = randomAlphanumeric(6);
        String expected = rightPad(serial, 25);

        controller.searchBySerial(serial);

        verify(mockConnector).makeRequest(expected);
    }

    @Test
    public void searchSerial_ResponseContainsSearchKeyAndIMSResults() throws Exception {
        String serial = randomAlphanumeric(6);
        when(mockConnector.makeRequest(anyString())).thenReturn(List.of("Hello", "World"));

        Map<String, Object> expected = Map.of("serial", serial, "results", List.of("Hello", "World"));

        Map<String, Object> response = controller.searchBySerial(serial);

        assertEquals(expected, response);
    }

    @Test
    public void searchSerial_CreatesConnectorWithSerialSearchTransaction() throws Exception {
        controller.searchBySerial(null);

        verify(mockConnectorFactory).createConnection("OLPPTSS");
    }

    @Test
    public void searchSerial_ConnectorIsClosedWhenConnectFails() throws Exception {
        doThrow(IOException.class).when(mockConnector).connect();

        try {
            controller.searchBySerial(randomAlphanumeric(6));
            fail("An IOException was expected");
        } catch (IOException ex) {
            verify(mockConnector).disconnect();
        }
    }

    @Test
    public void searchSerial_ConnectorIsClosedWhenMakeRequestFails() throws Exception {
        doThrow(IOException.class).when(mockConnector).makeRequest(anyString());

        try {
            controller.searchBySerial(randomAlphanumeric(6));
            fail("An IOException was expected");
        } catch (IOException ex) {
            verify(mockConnector).disconnect();
        }
    }
}
