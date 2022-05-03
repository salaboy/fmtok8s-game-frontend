package com.salaboy.conferences.game.event;

import com.salaboy.conferences.game.model.GameScore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("gamescores")
public class GameScoreController {

    private static final Logger log = LoggerFactory.getLogger(GameScoreController.class);

    @PostMapping
    GameScore addEvent(@RequestHeader HttpHeaders httpHeaders, @RequestBody GameScore gameScore) {
        log.info("Event received. Id: {}, type: {}.", httpHeaders.get("ce-id"), httpHeaders.get("ce-type"));
        log.info("GameScore: {}", gameScore);
        return gameScore;
    }

}
