package com.iynk.urlshortener.repository;

import com.iynk.urlshortener.model.UrlMapping;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Data access layer. By extending MongoRepository, Spring auto-generates
 * all the CRUD methods (save, findAll, findById, delete...) for us —
 * we don't write any implementation.
 *
 * The method names below are "derived queries": Spring reads the method
 * name and writes the query automatically.
 */
public interface UrlRepository extends MongoRepository<UrlMapping, String> {

    // SELECT * WHERE shortCode = ?
    Optional<UrlMapping> findByShortCode(String shortCode);

    // handy for making sure a generated code isn't already taken
    boolean existsByShortCode(String shortCode);

    // newest first, for the "recent links" list on the frontend
    List<UrlMapping> findAllByOrderByCreatedAtDesc();
}
