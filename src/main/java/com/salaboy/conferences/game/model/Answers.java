package com.salaboy.conferences.game.model;

public record Answers (
    boolean optionA,
    boolean optionB,
    boolean optionC,
    boolean optionD,
    String textual,
    int counter,
    int remainingTime,
    String sessionId,
    String nickname
){

}
