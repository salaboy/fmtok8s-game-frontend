package com.salaboy.conferences.game.rsocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.salaboy.conferences.game.GameController;
import com.salaboy.conferences.game.model.GameScore;
import com.salaboy.conferences.game.model.SessionScore;
import io.cloudevents.CloudEvent;
import io.cloudevents.CloudEventData;
import io.cloudevents.core.builder.CloudEventBuilder;
import io.cloudevents.jackson.JsonCloudEventData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.net.URI;
import java.time.Duration;
import java.util.Random;
import java.util.UUID;

@Controller
public class SessionScoreController {

    private static final Logger log = LoggerFactory.getLogger(GameController.class);
    private final ObjectMapper objectMapper;
    private final Sinks.Many<GameScore> gameScoreEmitter;

    public SessionScoreController(ObjectMapper objectMapper, Sinks.Many<GameScore> gameScoreEmitter) {
        this.objectMapper = objectMapper;
        this.gameScoreEmitter = gameScoreEmitter;
    }

    @MessageMapping("game-scores")
    public Flux<CloudEvent> gameScoresEvents() {
        log.info("Received game-scores request.");
        return gameScoreEmitter.asFlux()
                .map(gameScore -> CloudEventBuilder.v1()
                        .withId(UUID.randomUUID().toString())
                        .withSource(URI.create("game-frontend.default.svc.cluster.local"))
                        .withType("GameScoreEvent")
                        .withData(wrapCloudEventData(gameScore))
                        .build());
    }

    private CloudEventData wrapCloudEventData(Object object) {
        try {
            var sessionScoreJson = objectMapper.writeValueAsString(object);
            return JsonCloudEventData.wrap(objectMapper.readTree(sessionScoreJson));
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("The " + object.getClass().getName() + " object is not serializable to JSON.");
        }
    }

}
