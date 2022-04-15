package com.salaboy.conferences.game.model;

public class StartLevel {
    private String sessionId;
    private String level;

    private String gameTimeId;
    private String type;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getGameTimeId() {
        return gameTimeId;
    }

    public void setGameTimeId(String gameTimeId) {
        this.gameTimeId = gameTimeId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "StartLevel{" +
                "sessionId='" + sessionId + '\'' +
                ", level='" + level + '\'' +
                ", gameTimeId='" + gameTimeId + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
