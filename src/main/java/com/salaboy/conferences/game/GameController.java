package com.salaboy.conferences.game;

import com.salaboy.conferences.game.config.GameProperties;
import com.salaboy.conferences.game.model.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/game")
public class GameController {

    private final GameProperties gameProperties;
    private final WebClient webClient;

    public GameController(GameProperties gameProperties, WebClient.Builder webClientBuilder) {
        this.gameProperties = gameProperties;
        this.webClient = webClientBuilder.build();
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

    @GetMapping("/config")
    public Mono<LevelsConfig> getConfiguredLevels() {
        return Mono.just(new LevelsConfig(gameProperties.levels()));
    }

    @GetMapping("/leaderboard")
    public Mono<Leaderboard> getLeaderboard(@RequestParam(required = false) String nickname) throws URISyntaxException {
        URI uri = gameProperties.leaderboardUri();
        if (nickname != null && !nickname.isBlank()) {
            uri = new URI(uri.getScheme(), uri.getAuthority(), uri.getPath(),
                    "nickname=" + nickname, uri.getFragment());
        }
        return webClient
                .get()
                .uri(uri)
                .retrieve()
                .bodyToMono(Leaderboard.class);
    }

    @PostMapping(path = "/{levelId}/answer")
    public Mono<GameScore> answer(@PathVariable String levelId, @RequestBody Answers answers) {
        return webClient
                .post()
                .uri("http://" + levelId + ".default.svc.cluster.local")
                .bodyValue(answers)
                .retrieve()
                .bodyToMono(GameScore.class)
                .log();
    }

}
