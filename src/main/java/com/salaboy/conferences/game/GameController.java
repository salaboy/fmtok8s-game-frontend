package com.salaboy.conferences.game;

import com.salaboy.conferences.game.model.Answers;
import com.salaboy.conferences.game.model.Leaderboard;
import com.salaboy.conferences.game.model.StartLevel;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController()
@RequestMapping("/game/")
public class GameController {

    private RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/{nickname}")
    public String newGame(@PathVariable() String nickname) {
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> request = new HttpEntity<>(nickname, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://start-game.default.svc.cluster.local/?nickname="+nickname,
                request,
                String.class);
        return response.getBody();


    }

    @PostMapping("/{sessionId}/{levelName}/start")
    public String startLevel(@PathVariable() String sessionId, @PathVariable String levelName) {
        HttpHeaders headers = new HttpHeaders();
        StartLevel startLevel = new StartLevel();
        startLevel.setSessionId(sessionId);
        startLevel.setLevel(levelName);

        HttpEntity<StartLevel> request = new HttpEntity<>(startLevel, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://start-level.default.svc.cluster.local/",
                request,
                String.class);
        return response.getBody();
    }


    @GetMapping("/leaderboard")
    public Leaderboard getLeaderboard() {
        ResponseEntity<Leaderboard> response = restTemplate.exchange(
                "http://get-leaderboard.default.svc.cluster.local/", HttpMethod.GET, null,
                Leaderboard.class);

        return response.getBody();

    }

    @PostMapping(path = "/{sessionId}/level-{levelId}/answer")
    public String answer(@PathVariable() String sessionId, @PathVariable() String levelId, @RequestBody Answers answers) {
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<Answers> request = new HttpEntity<>(answers, headers);
        answers.setSessionId(sessionId);
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://questions-" + levelId + ".default.svc.cluster.local/",
                request,
                String.class);
        System.out.println("Level response: " + response.getBody());
        return response.getBody();
    }

}
