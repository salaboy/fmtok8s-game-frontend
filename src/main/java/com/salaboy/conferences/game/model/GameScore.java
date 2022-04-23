package com.salaboy.conferences.game.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public record GameScore(
        @JsonProperty("SessionId")
        String sessionId,
        @JsonProperty("Time")
        Date gameTime,
        @JsonProperty("Level")
        String level,
        @JsonProperty("LevelScore")
        int levelScore

) {
}
