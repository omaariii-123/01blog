package com.example.blog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // LOGIC:
        // When the browser asks for: http://localhost:8080/uploads/image.png
        // Spring looks in the folder: [Project Root]/uploads/
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/"); 
                // The dot (.) means "Current Project Directory"
    }
}