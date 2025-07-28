package com.example.drawing.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String baseDir = System.getProperty("user.dir");

        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + baseDir + "/images/");

        registry.addResourceHandler("/submissions/**")
                .addResourceLocations("file:" + baseDir + "/submissions/");
    }
}
