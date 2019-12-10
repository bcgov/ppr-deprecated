package ca.bc.gov.registries.ppr.search;

import ca.bc.gov.registries.ppr.imsconnect.IMSTransactionExecutor;
import ca.bc.gov.registries.ppr.imsconnect.message.SearchInputMessage;
import com.ibm.connector2.ims.ico.IMSInputStreamRecord;
import org.springframework.stereotype.Component;

import javax.resource.cci.Record;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Component
public class IMSSearchService implements ISearchService {
    private static final String SEARCH_UNLIMITED_INPUT_FORM = "OLPSEPO";
    private static final String SEARCH_LIMITED_INPUT_FORM = "OLPSELO";

    private IMSTransactionExecutor imsTransactionExecutor;

    IMSSearchService(IMSTransactionExecutor imsTransactionExecutor) {
        this.imsTransactionExecutor = imsTransactionExecutor;
    }

    @Override
    public List<String> findFinancialStatementsBySerial(String serial) throws Exception {
        SearchInputMessage inputMessage = new SearchInputMessage(serial.toUpperCase());

        Record outputMessage = imsTransactionExecutor.executeTransaction(inputMessage, new IMSInputStreamRecord(), SEARCH_UNLIMITED_INPUT_FORM);

        BufferedReader reader = new BufferedReader(new InputStreamReader(new ByteArrayInputStream(((IMSInputStreamRecord)outputMessage).getBuffer_()), "1141"));

        return reader.lines().collect(toList());
    }
}
