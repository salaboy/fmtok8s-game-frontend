package com.salaboy.conferences.game;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class GameUIService {

    public static void main(String[] args) {
        SpringApplication.run(GameUIService.class, args);
    }

}
