package ca.bc.gov.registries.ppr.search;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@RestController
@RequestMapping("/search")
public class SearchController {
    private ISearchService searchService;

    // Qualifier should be one of:
    //   IMSSearchService: Use IMS Connect
    //   stubSearchService: Use stubbed out fake date
    SearchController(@Qualifier("stubSearchService") ISearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public Map<String, Object> searchBySerial(@RequestParam(name="serial", required=false) String serial) throws Exception {
        Map<String, Object> response = new HashMap<>();

        // For now, if no serial is provided to search, generate one at random
        String queryValue = isNotBlank(serial) ? serial : randomAlphanumeric(17).toUpperCase();
        response.put("serial", queryValue);

        List<String> results = searchService.findFinancialStatementsBySerial(queryValue);
        response.put("results", results);

        return response;
    }
}
