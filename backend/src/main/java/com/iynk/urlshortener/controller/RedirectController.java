package com.iynk.urlshortener.controller;

import com.iynk.urlshortener.service.UrlService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

/**
 * Handles the actual short-link visits, e.g. GET /aZ3k9
 * This is what makes the short URL "work": it looks up the original
 * URL, bumps the click counter, and sends a 302 redirect to the browser.
 *
 * Note it's at the ROOT ("/") not under /api, so links stay short.
 */
@RestController
public class RedirectController {

    private final UrlService service;

    public RedirectController(UrlService service) {
        this.service = service;
    }

    @GetMapping("/{code}")
    public ResponseEntity<Void> redirect(@PathVariable String code) {
        String originalUrl = service.resolveAndCount(code);
        // 302 Found + Location header -> browser follows it to the real site
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(originalUrl))
                .build();
    }
}
