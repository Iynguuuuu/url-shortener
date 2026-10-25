package com.iynk.urlshortener.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * One row in the "url_mappings" MongoDB collection.
 * Each document maps a short code (e.g. "aZ3k9") to an original long URL,
 * and counts how many times the short link was visited.
 */
@Document(collection = "url_mappings")
@Data                   // Lombok: generates getters, setters, toString, equals
@Builder                // Lombok: lets us build objects fluently
@NoArgsConstructor      // needed by MongoDB to create objects
@AllArgsConstructor
public class UrlMapping {

    @Id
    private String id;              // Mongo's auto-generated _id

    private String originalUrl;     // the long URL the user submitted

    @Indexed(unique = true)         // fast lookups + no duplicate codes
    private String shortCode;       // the generated short code

    private long clicks;            // how many times the short link was opened

    private Instant createdAt;      // timestamp for sorting / analytics
}
