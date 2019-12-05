package ca.bc.gov.registries.ppr.search;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StubSearchService implements ISearchService {
    @Override
    public List<String> findFinancialStatementsBySerial(String serial) {
        return List.of("MV " + StringUtils.rightPad(serial, 25) + " 2010 MAZDA     ") ;
    }
}
