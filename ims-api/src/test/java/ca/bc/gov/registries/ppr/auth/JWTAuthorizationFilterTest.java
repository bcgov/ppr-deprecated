package ca.bc.gov.registries.ppr.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class JWTAuthorizationFilterTest {
    private JWTAuthorizationFilter filter;

    private FilterChain filterChain;

    @Before
    public void setUp() {
        filter = new JWTAuthorizationFilter();
        filterChain = mock(FilterChain.class);
    }

    @After
    public void tearDown() throws Exception {
        SecurityContextHolder.clearContext();
        verify(filterChain, times(1)).doFilter(notNull(), notNull());
    }

    @Test
    public void doFilter_AuthenticationShouldIncludeUsernameAndRolesFromToken() throws Exception {
        String jwt = createTestJWT();

        filter.doFilter(createTestRequest(jwt), new MockHttpServletResponse(), filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertEquals("myuser", auth.getPrincipal());
        assertEquals(List.of("test_role_1", "test_role_2"), auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(toList()));
    }

    @Test
    public void doFilter_ShouldNotAuthenticateWhenNoJWTProvided() throws Exception {
        HttpServletRequest request = createTestRequest(null);

        filter.doFilter(request, new MockHttpServletResponse(), filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNull(auth);
    }

    @Test
    public void doFilter_ShouldNotAuthenticateWhenJWTIsInvalid() throws Exception {
        HttpServletRequest request = createTestRequest(randomAlphanumeric(25));

        filter.doFilter(request, new MockHttpServletResponse(), filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNull(auth);
    }

    @Test
    public void doFilter_ShouldNotAuthenticateWhenUsernameNotInJWT() throws Exception {
        Map<String, Object> overrides = new HashMap<>();
        overrides.put("username", null);
        String jwt = createTestJWT(overrides);

        filter.doFilter(createTestRequest(jwt), new MockHttpServletResponse(), filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNull(auth);
    }

    @Test
    public void doFilter_ShouldNotAuthenticateWhenExpired() throws Exception {
        String jwt = createTestJWT(Map.of("expiresAt", DateUtils.addHours(new Date(), -1)));

        filter.doFilter(createTestRequest(jwt), new MockHttpServletResponse(), filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNull(auth);
    }

    @Test
    public void doFilter_ShouldAllowNullRoles() throws Exception {
        Map<String, Object> overrides = new HashMap<>();
        overrides.put("roles", null);
        String jwt = createTestJWT(overrides);

        filter.doFilter(createTestRequest(jwt), new MockHttpServletResponse(), filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertEquals(emptyList(), auth.getAuthorities());
    }

    private String createTestJWT() {
        return createTestJWT(emptyMap());
    }

    private String createTestJWT(Map<String, Object> overrides) {
        return JWT.create()
                .withExpiresAt((Date) overrides.getOrDefault("expiresAt", DateUtils.addMonths(new Date(), 1)))
                .withClaim("username", (String) overrides.getOrDefault("username", "myuser"))
                .withArrayClaim("roles", (String[]) overrides.getOrDefault("roles", new String[]{"test_role_1", "test_role_2"}))
                .sign(Algorithm.HMAC256("Temporary Algorithm"));
    }

    private HttpServletRequest createTestRequest(String jwt) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        if (jwt != null) {
            request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + jwt);
        }
        return request;
    }
}
