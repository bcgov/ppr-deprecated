package ca.bc.gov.registries.ppr.search;

import ca.bc.gov.registries.ppr.imsconnect.IMSTransactionExecutor;
import ca.bc.gov.registries.ppr.imsconnect.message.SearchInputMessage;
import com.ibm.connector2.ims.ico.IMSInputStreamRecord;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;

import javax.resource.cci.Record;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class IMSSearchServiceTest {
    private IMSSearchService service;

    private IMSTransactionExecutor mockTransactionExecutor;

    @Before
    public void setUp() throws Exception {
        mockTransactionExecutor = mock(IMSTransactionExecutor.class);
        when(mockTransactionExecutor.executeTransaction(any(), any(), anyString())).thenAnswer(invocation -> {
            // The executor will mutate the output parameter and then return it.  Make sure it has some data.
            Object[] args = invocation.getArguments();
            IMSInputStreamRecord output = (IMSInputStreamRecord)args[1];
            output.setBuffer_(randomAlphanumeric(10).getBytes());
            return output;
        });

        service = new IMSSearchService(mockTransactionExecutor);
    }

    @Test
    public void findFinancialStatementsBySerial_UsesUppercaseSerialForSearch() throws Exception {
        String serial = randomAlphanumeric(13);

        service.findFinancialStatementsBySerial(serial);

        ArgumentCaptor<Record> inputCaptor = ArgumentCaptor.forClass(Record.class);
        verify(mockTransactionExecutor).executeTransaction(inputCaptor.capture(), any(), any());
        assertTrue(inputCaptor.getValue() instanceof SearchInputMessage);
        assertEquals(serial.toUpperCase(), ((SearchInputMessage) inputCaptor.getValue()).getSerial());
    }

    @Test
    public void findFinancialStatementsBySerial_UsesUnlimitedSearch() throws Exception {
        String serial = randomAlphanumeric(13);

        service.findFinancialStatementsBySerial(serial);

        verify(mockTransactionExecutor).executeTransaction(any(), any(), eq("OLPSEPO"));
    }
}
