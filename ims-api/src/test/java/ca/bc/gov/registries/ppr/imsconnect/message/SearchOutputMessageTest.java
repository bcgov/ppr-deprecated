package ca.bc.gov.registries.ppr.imsconnect.message;

import ca.bc.gov.registries.ppr.search.VehicleSummarySearchResult;
import org.junit.Test;

import java.io.InputStream;
import java.util.List;

import static ca.bc.gov.registries.ppr.imsconnect.message.ByteArrayUtils.EBCDIC_CHAR_SET;
import static org.junit.Assert.*;

public class SearchOutputMessageTest {
    @Test
    public void testGetUsername() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        assertEquals("PA86737", message.getUsername());
    }

    @Test
    public void testGetLimit() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        assertEquals(200, message.getLimit());
    }

    @Test
    public void testGetSystemMessage() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        assertEquals("SSR102 - PRESS ENTER FOR MORE INFORMATION", message.getSystemMessage());
    }

    @Test
    public void testGetTransaction() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        assertEquals("SS", message.getTransaction());
    }

    @Test
    public void testGetFolio() throws Exception {
        SearchOutputMessage message = getSampleMessage();
        overwriteBytes(message, 266, "    SOME FOLIO NUM".getBytes(EBCDIC_CHAR_SET));

        assertEquals("SOME FOLIO NUM", message.getFolio());
    }

    @Test
    public void testApplicationId() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        assertEquals("P.P.R. - SERIAL SEARCH INDEX", message.getApplicationId());
    }

    @Test
    public void testGetExactMatchCount_ShouldReturnZeroWhenBlank() throws Exception {
        SearchOutputMessage message = getSampleMessage();
        overwriteBytes(message, 313, "        ".getBytes(EBCDIC_CHAR_SET));

        assertEquals(0, message.getExactMatchCount());
    }

    @Test
    public void testGetExactMatchCount_ShouldParseIntWhenPresent() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        assertEquals(1, message.getExactMatchCount());
    }

    @Test
    public void testGetSerial() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        assertEquals("G45555555", message.getSerial());
    }

    @Test
    public void testGetVehicles_ShouldProvideReturnedVehicles() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        List<VehicleSummarySearchResult> vehicles = message.getVehicles();
        assertEquals(15, vehicles.size());
    }

    @Test
    public void testGetVehicle_Exact() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        List<VehicleSummarySearchResult> vehicles = message.getVehicles();
        assertTrue(vehicles.get(0).isExactMatch());
    }

    @Test
    public void testGetVehicle_Inexact() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        List<VehicleSummarySearchResult> vehicles = message.getVehicles();
        assertFalse(vehicles.get(1).isExactMatch());
    }

    @Test
    public void testGetVehicle_Type() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        List<VehicleSummarySearchResult> vehicles = message.getVehicles();
        assertEquals("BO", vehicles.get(0).getType());
        assertEquals("MV", vehicles.get(1).getType());
    }

    @Test
    public void testGetVehicle_VIN() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        List<VehicleSummarySearchResult> vehicles = message.getVehicles();
        assertEquals("G45555555", vehicles.get(0).getVIN());
        assertEquals("J5555155555555555", vehicles.get(1).getVIN());
    }

    @Test
    public void testGetVehicle_Year() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        List<VehicleSummarySearchResult> vehicles = message.getVehicles();
        assertEquals(Integer.valueOf(1989), vehicles.get(0).getYear());
        assertEquals(Integer.valueOf(2005), vehicles.get(1).getYear());
    }

    @Test
    public void testGetVehicle_YearShouldBeNullWhenValueIsEmpty() throws Exception {
        SearchOutputMessage message = getSampleMessage();
        overwriteBytes(message, 416, "    ".getBytes(EBCDIC_CHAR_SET));

        List<VehicleSummarySearchResult> vehicles = message.getVehicles();
        assertNull(vehicles.get(0).getYear());
    }

    @Test
    public void testGetVehicle_Make() throws Exception {
        SearchOutputMessage message = getSampleMessage();

        List<VehicleSummarySearchResult> vehicles = message.getVehicles();
        assertEquals("TY EE", vehicles.get(0).getMake());
        assertEquals("MAZDA VIPER", vehicles.get(1).getMake());
    }

    private void overwriteBytes(SearchOutputMessage message, int offset, byte[] newValue) {
        byte[] buffer = message.getBytes();
        System.arraycopy(newValue, 0, buffer, offset, newValue.length);
        message.setBytes(buffer);
    }

    private SearchOutputMessage getSampleMessage() throws Exception {
        SearchOutputMessage message = new SearchOutputMessage();
        InputStream inputStream = getClass().getResourceAsStream("/vehicle-search-output.ebcidic");
        try {
            message.setBytes(inputStream.readAllBytes());
        }
        finally {
            inputStream.close();
        }
        return message;
    }
}
