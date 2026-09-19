package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // =========================
    // PASSWORD ENCODER
    // =========================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================
    // CORS CONFIG
    // =========================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // ✅ Allow localhost (dev) + all Vercel deployments (production)
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:5173",
            "http://localhost:3000",
            "https://*.vercel.app",
            "https://vercel.app",
            "https://e-commerce-l54a-psi.vercel.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // =========================
    // SECURITY CONFIG
    // =========================
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

    // PUBLIC
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/categories/**").permitAll()
    .requestMatchers("/api/products/**").permitAll()
    .requestMatchers("/uploads/**").permitAll()
    .requestMatchers("/api/migrate/**").permitAll()

    // USER ONLY
    .requestMatchers("/api/cart/**").hasRole("USER")
    .requestMatchers("/api/orders/checkout").hasRole("USER")
    .requestMatchers("/api/orders/pay/**").hasRole("USER")
    .requestMatchers("/api/orders/my").hasRole("USER")
    .requestMatchers("/api/orders/cancel/**").hasRole("USER")
    .requestMatchers("/api/reviews/**").permitAll()

    // ADMIN ONLY
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/orders/all").hasRole("ADMIN")
    .requestMatchers("/api/orders/status/**").hasRole("ADMIN")
    

    // IMPORTANT: specific order access handled in controller
    .requestMatchers("/api/orders/track/**").hasAnyRole("USER","ADMIN")
    .requestMatchers("/api/orders/**").authenticated()
    .requestMatchers("/api/user/profile").authenticated()
    .anyRequest().authenticated()
);

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // =========================
    // AUTH MANAGER
    // =========================
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}