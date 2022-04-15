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
    @JsonProperty("Time")
    Date gameTime,
    @JsonProperty("LastLevel")
    String lastLevel,
    @JsonProperty("AccumulatedTimeInSeconds")
    long accumulatedTimeInSeconds
){}
