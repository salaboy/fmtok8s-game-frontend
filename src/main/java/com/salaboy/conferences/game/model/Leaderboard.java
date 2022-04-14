package com.salaboy.conferences.game.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record Leaderboard(
    @JsonProperty("Sessions")
    List<SessionScore> sessionScores
){}
