package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class TiDbConfig {

    @Bean
    public CommandLineRunner configureTiDb(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE order_table AUTO_ID_CACHE = 1");
                jdbcTemplate.execute("ALTER TABLE order_item AUTO_ID_CACHE = 1");
                jdbcTemplate.execute("ALTER TABLE users AUTO_ID_CACHE = 1");
                jdbcTemplate.execute("ALTER TABLE category AUTO_ID_CACHE = 1");
                jdbcTemplate.execute("ALTER TABLE product AUTO_ID_CACHE = 1");
                jdbcTemplate.execute("ALTER TABLE cart_item AUTO_ID_CACHE = 1");
                jdbcTemplate.execute("ALTER TABLE review AUTO_ID_CACHE = 1");
                jdbcTemplate.execute("ALTER TABLE wishlist AUTO_ID_CACHE = 1");
                System.out.println("✅ TiDB AUTO_ID_CACHE set to 1 for consecutive IDs on all tables!");
            } catch (Exception e) {
                System.out.println("⚠️ Could not alter table for TiDB AUTO_ID_CACHE: " + e.getMessage());
            }
        };
    }
}
