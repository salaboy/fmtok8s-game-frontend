package com.salaboy.conferences.game.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = "game.index-page-path=/static/index.html")
class WebEndpointsTests {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void whenBackOfficeThenReturnIndexPage() {
        // This is failing because I am using index.html from outside the spring boot application
        webTestClient
                .get()
                .uri("/back-office")
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentType(MediaType.TEXT_HTML)
                .expectBody(String.class).value(body ->
                    assertThat(body).startsWith("<!DOCTYPE html>"));
    }

}
