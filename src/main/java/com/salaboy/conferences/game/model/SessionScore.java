package com.salaboy.conferences.game.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public record SessionScore(
        @JsonProperty("SessionId")
        String sessionId,
        @JsonProperty("AccumulatedScore")
        String accumulatedScore,
        @JsonProperty("Nickname")
        String nickname,
        @JsonProperty("LastLevel")
        String lastLevel,
        @JsonProperty("Selected")
        boolean selected
) {
}
