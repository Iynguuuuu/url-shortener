package com.iynk.urlshortener.controller;

import com.iynk.urlshortener.dto.CreateUrlRequest;
import com.iynk.urlshortener.dto.UrlResponse;
import com.iynk.urlshortener.service.UrlService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * The JSON API used by the React frontend.
 * Everything here lives under /api so it doesn't clash with the
 * public redirect endpoint (RedirectController).
 */
@RestController
@RequestMapping("/api")
public class UrlController {

    private final UrlService service;

    public UrlController(UrlService service) {
        this.service = service;
    }

    /**
     * POST /api/shorten
     * Body: { "url": "https://..." }
     * Returns the created short link. @Valid triggers the validation
     * annotations on CreateUrlRequest.
     */
    @PostMapping("/shorten")
    @ResponseStatus(HttpStatus.CREATED)
    public UrlResponse shorten(@Valid @RequestBody CreateUrlRequest request) {
        return service.shorten(request.getUrl());
    }

    /** GET /api/urls -> list of all short links, newest first. */
    @GetMapping("/urls")
    public List<UrlResponse> listAll() {
        return service.listAll();
    }

    /** GET /api/urls/{code}/stats -> analytics for one link. */
    @GetMapping("/urls/{code}/stats")
    public UrlResponse stats(@PathVariable String code) {
        return service.getStats(code);
    }
}
