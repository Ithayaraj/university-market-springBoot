package com.spring_boot.uni_market.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Expose the 'uploads' directory to the web
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
