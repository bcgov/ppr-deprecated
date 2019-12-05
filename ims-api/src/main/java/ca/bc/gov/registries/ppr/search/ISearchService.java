package ca.bc.gov.registries.ppr.search;

import java.util.List;

public interface ISearchService {
    List<String> findFinancialStatementsBySerial(String serial) throws Exception;
}
