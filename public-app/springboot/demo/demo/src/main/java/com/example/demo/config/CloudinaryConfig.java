package com.example.demo.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
                "cloud_name", "uogvrgkk",
                "api_key", "628365618178584",
                "api_secret", "NLbfovzcC9VWzu98sjurQ4GC_lA",
                "secure", true
        ));
    }
}