package ca.bc.gov.registries.ppr.search;

import org.junit.Before;
import org.junit.Test;

import java.util.List;
import java.util.Map;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class SearchControllerTest {
    private SearchController controller;

    private ISearchService mockSearchService;

    @Before
    public void setUp() {
        mockSearchService = mock(ISearchService.class);

        controller = new SearchController(mockSearchService);
    }

    @Test
    public void searchSerial_ShouldProvideSerialToService() throws Exception {
        String serial = randomAlphanumeric(6);

        controller.searchBySerial(serial);

        verify(mockSearchService).findFinancialStatementsBySerial(serial);
    }

    @Test
    public void searchSerial_ResponseContainsSearchKeyAndIMSResults() throws Exception {
        String serial = randomAlphanumeric(6);
        VehicleSummarySearchResult vehicle = new VehicleSummarySearchResult(true, "MV", serial, 2010, "MAZDA");
        when(mockSearchService.findFinancialStatementsBySerial(anyString())).thenReturn(List.of(vehicle));

        Map<String, Object> expected = Map.of("serial", serial, "results", List.of(vehicle));

        Map<String, Object> response = controller.searchBySerial(serial);

        assertEquals(expected, response);
    }
}
