package ca.bc.gov.registries.ppr.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;

public class JWTAuthorizationFilter extends OncePerRequestFilter {
    private Log logger = LogFactory.getLog(getClass());

    private static final String TOKEN_PREFIX = "Bearer ";
    private static final String USERNAME_CLAIM = "username";
    private static final String ROLES_CLAIM = "roles";

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse resp, FilterChain chain) throws IOException, ServletException {
        try {
            String header = req.getHeader(HttpHeaders.AUTHORIZATION);
            if (header == null || !header.startsWith(TOKEN_PREFIX)) {
                return;
            }

            String token = header.replaceFirst(TOKEN_PREFIX, "");
            Authentication authentication = getAuthentication(token);

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        catch (Exception ex) {
            logger.warn("Exception while handling JWT auth: " + ex.getMessage(), ex);
        }
        finally {
            chain.doFilter(req, resp);
        }
    }

    private Authentication getAuthentication(String jwt) {
        DecodedJWT decodedJWT = JWT.decode(jwt);

        Claim userClaim = decodedJWT.getClaim(USERNAME_CLAIM);
        if (userClaim.isNull() || new Date().after(decodedJWT.getExpiresAt())) {
            return null;
        }

        // TODO The JWT needs to be validated, which requires a public and private key, so will need to be validated with the issuer.
        //   JWT.require(Algorithm.RSA256(null, null)).build().verify(decodedJWT);

        Claim rolesClaim = decodedJWT.getClaim(ROLES_CLAIM);
        List<GrantedAuthority> authorities = rolesClaim.isNull() ? emptyList() : rolesClaim.asList(String.class).stream().map(SimpleGrantedAuthority::new).collect(toList());

        return new UsernamePasswordAuthenticationToken(userClaim.asString(), null, authorities);
    }
}
