package com.iynk.urlshortener;

import com.iynk.urlshortener.dto.UrlResponse;
import com.iynk.urlshortener.exception.NotFoundException;
import com.iynk.urlshortener.model.UrlMapping;
import com.iynk.urlshortener.repository.UrlRepository;
import com.iynk.urlshortener.service.UrlService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UrlService. We use Mockito to fake the repository,
 * so these tests run fast and need no database. The GitHub Actions
 * pipeline runs these on every push.
 */
@ExtendWith(MockitoExtension.class)
class UrlServiceTest {

    @Mock
    private UrlRepository repository;

    @InjectMocks
    private UrlService service;

    @BeforeEach
    void setUp() {
        // inject the @Value field manually since there's no Spring context here
        ReflectionTestUtils.setField(service, "baseUrl", "http://localhost:8080");
    }

    @Test
    void shorten_createsMappingWithSixCharCode() {
        when(repository.existsByShortCode(anyString())).thenReturn(false);
        when(repository.save(any(UrlMapping.class))).thenAnswer(inv -> inv.getArgument(0));

        UrlResponse response = service.shorten("https://example.com");

        assertThat(response.getOriginalUrl()).isEqualTo("https://example.com");
        assertThat(response.getShortCode()).hasSize(6);
        assertThat(response.getShortUrl()).isEqualTo("http://localhost:8080/" + response.getShortCode());
        assertThat(response.getClicks()).isZero();
        verify(repository).save(any(UrlMapping.class));
    }

    @Test
    void resolveAndCount_incrementsClicksAndReturnsOriginalUrl() {
        UrlMapping mapping = UrlMapping.builder()
                .shortCode("abc123")
                .originalUrl("https://example.com")
                .clicks(4)
                .createdAt(Instant.now())
                .build();
        when(repository.findByShortCode("abc123")).thenReturn(Optional.of(mapping));
        when(repository.save(any(UrlMapping.class))).thenAnswer(inv -> inv.getArgument(0));

        String result = service.resolveAndCount("abc123");

        assertThat(result).isEqualTo("https://example.com");
        assertThat(mapping.getClicks()).isEqualTo(5);  // incremented
        verify(repository).save(mapping);
    }

    @Test
    void resolveAndCount_throwsWhenCodeMissing() {
        when(repository.findByShortCode("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.resolveAndCount("missing"))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("missing");
    }

    @Test
    void getStats_doesNotIncrementClicks() {
        UrlMapping mapping = UrlMapping.builder()
                .shortCode("abc123")
                .originalUrl("https://example.com")
                .clicks(7)
                .createdAt(Instant.now())
                .build();
        when(repository.findByShortCode("abc123")).thenReturn(Optional.of(mapping));

        UrlResponse response = service.getStats("abc123");

        assertThat(response.getClicks()).isEqualTo(7);  // unchanged
        verify(repository, never()).save(any());
    }
}
