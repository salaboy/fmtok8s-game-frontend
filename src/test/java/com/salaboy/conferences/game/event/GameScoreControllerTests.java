package com.salaboy.conferences.game.event;

import com.salaboy.conferences.game.model.GameScore;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.sql.Date;
import java.time.Instant;
import java.util.UUID;

@WebFluxTest(GameScoreController.class)
class GameScoreControllerTests {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void whenCloudEventPublishedThenConsumed() {
        var gameScore = new GameScore(UUID.randomUUID().toString(), Date.from(Instant.now()), "level-3", 42);
        webTestClient
                .post()
                .uri("/gamescores")
                .header("ce-id", UUID.randomUUID().toString())
                .header("ce-type", "GameScoreEvent")
                .bodyValue(gameScore)
                .exchange()
                .expectStatus().isOk()
                .expectBody(GameScore.class).isEqualTo(gameScore);
    }

}
