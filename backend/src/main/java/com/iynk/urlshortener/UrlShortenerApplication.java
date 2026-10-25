package com.iynk.urlshortener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point of the whole application.
 * The main() method boots Spring, which starts an embedded Tomcat server
 * (default port 8080) and wires all the beans (controllers, services, repos).
 */
@SpringBootApplication
public class UrlShortenerApplication {

    public static void main(String[] args) {
        SpringApplication.run(UrlShortenerApplication.class, args);
    }
}
