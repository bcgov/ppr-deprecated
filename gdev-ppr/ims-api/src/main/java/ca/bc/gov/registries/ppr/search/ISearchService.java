package ca.bc.gov.registries.ppr.search;

import java.util.List;

public interface ISearchService {
    List<VehicleSummarySearchResult> findFinancialStatementsBySerial(String serial) throws Exception;
}
