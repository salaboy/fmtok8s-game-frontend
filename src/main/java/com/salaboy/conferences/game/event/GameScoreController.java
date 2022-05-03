package com.salaboy.conferences.game.event;

import com.salaboy.conferences.game.model.GameScore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.time.Duration;

@RestController
@RequestMapping("gamescores")
public class GameScoreController {

    private static final Logger log = LoggerFactory.getLogger(GameScoreController.class);

    private final Sinks.Many<GameScore> gameScoreEmitter = Sinks.many().multicast().onBackpressureBuffer();

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    Flux<GameScore> getEvents() {
        return gameScoreEmitter.asFlux();
    }

    @PostMapping
    void addEvent(@RequestHeader HttpHeaders httpHeaders, @RequestBody GameScore gameScore) {
        Assert.notEmpty(httpHeaders.get("ce-id"), "A CloudEvent id must provided as a request header.");
        Assert.notEmpty(httpHeaders.get("ce-type"), "A CloudEvent type must provided as a request header.");
        Assert.notNull(gameScore, "A GameScore object must be provided in the request body.");

        log.info("Event received. Id: {}, type: {}.", httpHeaders.get("ce-id"), httpHeaders.get("ce-type"));
        log.info("GameScore: {}", gameScore);

        gameScoreEmitter.emitNext(gameScore, Sinks.EmitFailureHandler.busyLooping(Duration.ofSeconds(5)));
    }

}
