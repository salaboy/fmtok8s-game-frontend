package com.salaboy.conferences.game.web;

import com.salaboy.conferences.game.config.GameProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
public class WebEndpoints {

    private static final Logger log = LoggerFactory.getLogger(WebEndpoints.class);

    private final GameProperties gameProperties;

    public WebEndpoints(GameProperties gameProperties) {
        this.gameProperties = gameProperties;
    }

    @Bean
    public RouterFunction<ServerResponse> indexRouter() {
        return route()
                .GET("/back-office", request ->
                    ServerResponse.ok().contentType(MediaType.TEXT_HTML).bodyValue(getIndexPage()))
                .GET("/back-office/**", request ->
                        ServerResponse.ok().contentType(MediaType.TEXT_HTML).bodyValue(getIndexPage()))
                .build();
    }

    private Object getIndexPage() {
        var indexPage = new ClassPathResource(gameProperties.indexPagePath());
        if (!indexPage.exists()) {
            // This should only happen when running the app locally in development mode.
            return "The 'index.html' page doesn't exist.";
        }
        return indexPage;
    }

}
