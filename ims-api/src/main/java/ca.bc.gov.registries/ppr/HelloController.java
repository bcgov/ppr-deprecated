package ca.bc.gov.registries.ppr;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HelloController {
    @RequestMapping("/")
    public Map<String, String> hello() {
        return Map.of("message", "Hello World");
    }
}
