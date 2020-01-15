package ca.bc.gov.registries.ppr.imsconnect.message;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Test;

public class SearchInputMessageTest {
    @Test(expected = IllegalArgumentException.class)
    public void constructor_FailsWhenSerialExceeds25Characters() {
        String serial = RandomStringUtils.randomAlphanumeric(26);
        new SearchInputMessage(serial);
    }
}
