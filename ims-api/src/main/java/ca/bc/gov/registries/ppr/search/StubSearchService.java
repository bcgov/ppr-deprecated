package ca.bc.gov.registries.ppr.search;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StubSearchService implements ISearchService {
    @Override
    public List<VehicleSummarySearchResult> findFinancialStatementsBySerial(String serial) {
        return List.of(new VehicleSummarySearchResult(true, "MV", serial, 2010, "MAZDA"));
    }
}
