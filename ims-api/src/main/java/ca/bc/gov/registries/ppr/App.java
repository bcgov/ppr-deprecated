package ca.bc.gov.registries.ppr;

import io.jaegertracing.Configuration;
import io.opentracing.Tracer;
import io.sentry.spring.SentryExceptionResolver;
import io.sentry.spring.SentryServletContextInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.HandlerExceptionResolver;

@SpringBootApplication
public class App {
    private static final String APP_NAME = "ims-api";

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @Bean
    public HandlerExceptionResolver sentryExceptionResolver() {
        return new SentryExceptionResolver();
    }

    @Bean
    public ServletContextInitializer sentryServletContextInitializer() {
        return new SentryServletContextInitializer();
    }

    @Bean
    public Tracer tracer() {
        return Configuration.fromEnv(APP_NAME).getTracer();
    }
}
