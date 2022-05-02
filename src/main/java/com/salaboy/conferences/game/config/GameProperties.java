package com.salaboy.conferences.game.config;

import com.salaboy.conferences.game.model.LevelEntry;
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
        List<LevelEntry> levels
){}
