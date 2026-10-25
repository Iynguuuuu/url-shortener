package com.iynk.urlshortener.exception;

/**
 * Thrown when a short code doesn't exist. Handled centrally
 * by GlobalExceptionHandler, which turns it into a 404 response.
 */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
