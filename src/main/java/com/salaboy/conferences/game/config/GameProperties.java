package com.salaboy.conferences.game.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.net.URI;

@ConfigurationProperties(prefix = "game")
public record GameProperties(
        String indexPagePath,
        URI startGameUri,
        URI startLevelUri,
        URI leaderboardUri
){}
