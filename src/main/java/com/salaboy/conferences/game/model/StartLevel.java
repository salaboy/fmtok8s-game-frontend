package com.salaboy.conferences.game.model;

import java.util.Date;

public class StartLevel {
    private String sessionId;
    private String level;
    private Date time;
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

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
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
                ", time=" + time +
                ", gameTimeId='" + gameTimeId + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}
