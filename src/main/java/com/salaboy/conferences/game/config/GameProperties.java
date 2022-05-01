package com.salaboy.conferences.game.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.net.URI;
import java.util.List;
import java.util.Map;

@ConfigurationProperties(prefix = "game")
public record GameProperties(
        String indexPagePath,
        URI startGameUri,
        URI startLevelUri,
        URI leaderboardUri,
        Map<String, String> levelsAndFunctions
){}
