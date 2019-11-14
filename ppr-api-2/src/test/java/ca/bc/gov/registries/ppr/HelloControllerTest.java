package ca.bc.gov.registries.ppr;

import org.junit.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class HelloControllerTest {
    private HelloController controller = new HelloController();

    @Test
    public void hello() {
        assertEquals(Map.of("message", "Hello World"), controller.hello());
    }
}
