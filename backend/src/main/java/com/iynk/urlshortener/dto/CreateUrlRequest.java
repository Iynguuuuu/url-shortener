package com.iynk.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * Shape of the JSON body the frontend sends to POST /api/shorten.
 * Example: { "url": "https://example.com/some/very/long/path" }
 *
 * The validation annotations reject bad input automatically (400 error)
 * before our code even runs.
 */
@Data
public class CreateUrlRequest {

    @NotBlank(message = "URL is required")
    @Pattern(
            regexp = "^(https?://).+",
            message = "URL must start with http:// or https://"
    )
    private String url;
}
