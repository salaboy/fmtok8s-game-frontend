package com.salaboy.conferences.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.salaboy.conferences.game.config.GameProperties;
import com.salaboy.conferences.game.model.Answers;
import com.salaboy.conferences.game.model.Leaderboard;
import com.salaboy.conferences.game.model.StartLevel;
import io.cloudevents.CloudEvent;
import io.cloudevents.core.builder.CloudEventBuilder;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.time.Duration;
import java.util.UUID;

@RestController
@RequestMapping("/game")
public class GameController {

    private final GameProperties gameProperties;
    private final WebClient webClient;

    record Message(Long id, String content) {
    }

    private final ObjectMapper objectMapper;

    public GameController(GameProperties gameProperties, WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.gameProperties = gameProperties;
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    @PostMapping("/{nickname}")
    public Mono<String> newGame(@PathVariable String nickname) {
        return webClient
                .post()
                .uri(gameProperties.startGameUri() + "/?nickname=" + nickname)
                .bodyValue(nickname)
                .retrieve()
                .bodyToMono(String.class);
    }

    @PostMapping("/{sessionId}/{levelName}/start")
    public Mono<String> startLevel(@PathVariable String sessionId, @PathVariable String levelName) {
        StartLevel startLevel = new StartLevel();
        startLevel.setSessionId(sessionId);
        startLevel.setLevel(levelName);

        return webClient
                .post()
                .uri(gameProperties.startLevelUri())
                .bodyValue(startLevel)
                .retrieve()
                .bodyToMono(String.class);
    }

    @GetMapping("/leaderboard")
    public Mono<Leaderboard> getLeaderboard() {
        return webClient
                .get()
                .uri(gameProperties.leaderboardUri())
                .retrieve()
                .bodyToMono(Leaderboard.class);
    }

    @PostMapping(path = "/{sessionId}/level-{levelId}/answer")
    public Mono<String> answer(@PathVariable String sessionId, @PathVariable String levelId, @RequestBody Answers answers) {
        answers.setSessionId(sessionId);
        return webClient
                .post()
                .uri("http://level-" + levelId + ".default.svc.cluster.local")
                .bodyValue(answers)
                .retrieve()
                .bodyToMono(String.class)
                .log();
    }

    @MessageMapping("infinite-stream")
    public Flux<Message> infiniteStream() {
        return Flux.interval(Duration.ofSeconds(1))
                .map(index -> new Message(index, "Message " + index))
                .log();
    }

}
