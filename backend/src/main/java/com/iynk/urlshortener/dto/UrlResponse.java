package com.iynk.urlshortener.dto;

import com.iynk.urlshortener.model.UrlMapping;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

/**
 * Shape of the JSON we send BACK to the frontend.
 * We never return the raw DB object directly — a DTO keeps the API
 * clean and lets us add the full "shortUrl" that the user can click.
 */
@Data
@Builder
@AllArgsConstructor
public class UrlResponse {

    private String shortCode;
    private String originalUrl;
    private String shortUrl;     // e.g. http://localhost:8080/aZ3k9
    private long clicks;
    private Instant createdAt;

    /**
     * Convert a DB entity + base URL into the response object.
     */
    public static UrlResponse from(UrlMapping mapping, String baseUrl) {
        return UrlResponse.builder()
                .shortCode(mapping.getShortCode())
                .originalUrl(mapping.getOriginalUrl())
                .shortUrl(baseUrl + "/" + mapping.getShortCode())
                .clicks(mapping.getClicks())
                .createdAt(mapping.getCreatedAt())
                .build();
    }
}
