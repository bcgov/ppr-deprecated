package ca.bc.gov.registries.ppr.search;

import ca.bc.gov.registries.imsconnect.IMSConnector;
import ca.bc.gov.registries.ppr.imsconnect.IMSConnectorFactory;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.apache.commons.lang3.StringUtils.rightPad;
import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class IMSSearchServiceTest {
    private IMSSearchService service;

    private IMSConnectorFactory mockConnectorFactory;
    private IMSConnector mockConnector;

    @Before
    public void setUp() {
        mockConnector = mock(IMSConnector.class);
        mockConnectorFactory = mock(IMSConnectorFactory.class);
        when(mockConnectorFactory.createConnection(anyString())).thenReturn(mockConnector);

        service = new IMSSearchService(mockConnectorFactory);
    }

    @Test
    public void findFinancialStatementsBySerial_ShouldPadInputTo25Characters() throws Exception {
        String serial = randomAlphanumeric(6);
        String expected = rightPad(serial, 25);

        service.findFinancialStatementsBySerial(serial);

        verify(mockConnector).makeRequest(expected);
    }

    @Test
    public void findFinancialStatementsBySerial_CreatesConnectorWithSerialSearchTransaction() throws Exception {
        service.findFinancialStatementsBySerial(null);

        verify(mockConnectorFactory).createConnection("OLPPTSS");
    }

    @Test
    public void findFinancialStatementsBySerial_ConnectorIsClosedWhenConnectFails() throws Exception {
        doThrow(IOException.class).when(mockConnector).connect();

        try {
            service.findFinancialStatementsBySerial(randomAlphanumeric(6));
            fail("An IOException was expected");
        } catch (IOException ex) {
            verify(mockConnector).disconnect();
        }
    }

    @Test
    public void findFinancialStatementsBySerial_ConnectorIsClosedWhenMakeRequestFails() throws Exception {
        doThrow(IOException.class).when(mockConnector).makeRequest(anyString());

        try {
            service.findFinancialStatementsBySerial(randomAlphanumeric(6));
            fail("An IOException was expected");
        } catch (IOException ex) {
            verify(mockConnector).disconnect();
        }
    }

}
