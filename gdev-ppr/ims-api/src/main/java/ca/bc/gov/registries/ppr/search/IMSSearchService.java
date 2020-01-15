package ca.bc.gov.registries.ppr.search;

import ca.bc.gov.registries.ppr.imsconnect.IMSTransactionExecutor;
import ca.bc.gov.registries.ppr.imsconnect.message.SearchInputMessage;
import ca.bc.gov.registries.ppr.imsconnect.message.SearchOutputMessage;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class IMSSearchService implements ISearchService {
    private static final String SEARCH_UNLIMITED_INPUT_FORM = "OLPSEPO";
    private static final String SEARCH_LIMITED_INPUT_FORM = "OLPSELO";

    private IMSTransactionExecutor imsTransactionExecutor;

    IMSSearchService(IMSTransactionExecutor imsTransactionExecutor) {
        this.imsTransactionExecutor = imsTransactionExecutor;
    }

    @Override
    public List<VehicleSummarySearchResult> findFinancialStatementsBySerial(String serial) throws Exception {
        SearchInputMessage inputMessage = new SearchInputMessage(serial.toUpperCase());
        SearchOutputMessage outputMessage = new SearchOutputMessage();

        imsTransactionExecutor.executeTransaction(inputMessage, outputMessage, SEARCH_UNLIMITED_INPUT_FORM);

        return outputMessage.getVehicles();
    }
}
