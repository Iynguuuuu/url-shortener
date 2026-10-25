package com.iynk.urlshortener.service;

import com.iynk.urlshortener.dto.UrlResponse;
import com.iynk.urlshortener.exception.NotFoundException;
import com.iynk.urlshortener.model.UrlMapping;
import com.iynk.urlshortener.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;

/**
 * The "brain" of the app. Controllers stay thin and hand all real work
 * (generating codes, saving, counting clicks) to this service.
 */
@Service
public class UrlService {

    private final UrlRepository repository;

    // The public base URL of the backend, read from application.properties.
    // Used to build the full short link we return to the user.
    @Value("${app.base-url}")
    private String baseUrl;

    // Characters allowed in a short code (no confusing 0/O, 1/l removed for clarity).
    private static final String ALPHABET =
            "abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    // Constructor injection: Spring passes in the repository automatically.
    public UrlService(UrlRepository repository) {
        this.repository = repository;
    }

    /**
     * Take a long URL, generate a unique short code, save it, and
     * return the response object.
     */
    public UrlResponse shorten(String originalUrl) {
        String code = generateUniqueCode();

        UrlMapping mapping = UrlMapping.builder()
                .originalUrl(originalUrl)
                .shortCode(code)
                .clicks(0)
                .createdAt(Instant.now())
                .build();

        repository.save(mapping);
        return UrlResponse.from(mapping, baseUrl);
    }

    /**
     * Look up the original URL for a code AND increment its click counter.
     * Called when someone visits a short link. Throws 404 if not found.
     */
    public String resolveAndCount(String shortCode) {
        UrlMapping mapping = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new NotFoundException("Short code not found: " + shortCode));

        mapping.setClicks(mapping.getClicks() + 1);
        repository.save(mapping);
        return mapping.getOriginalUrl();
    }

    /** Stats for a single short code (no click increment). */
    public UrlResponse getStats(String shortCode) {
        UrlMapping mapping = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new NotFoundException("Short code not found: " + shortCode));
        return UrlResponse.from(mapping, baseUrl);
    }

    /** All links, newest first — powers the dashboard list. */
    public List<UrlResponse> listAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(m -> UrlResponse.from(m, baseUrl))
                .toList();
    }

    /**
     * Keep trying random codes until we find one not already in the DB.
     * With a 57-char alphabet and length 6, collisions are extremely rare.
     */
    private String generateUniqueCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
            }
            code = sb.toString();
        } while (repository.existsByShortCode(code));
        return code;
    }
}
