package com.salaboy.conferences.game.config;

import io.cloudevents.spring.codec.CloudEventDecoder;
import io.cloudevents.spring.codec.CloudEventEncoder;
import io.cloudevents.spring.webflux.CloudEventHttpMessageReader;
import io.cloudevents.spring.webflux.CloudEventHttpMessageWriter;
import org.springframework.boot.rsocket.messaging.RSocketStrategiesCustomizer;
import org.springframework.boot.web.codec.CodecCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.codec.CodecConfigurer;

@Configuration
public class CloudEventConfig implements CodecCustomizer {

    @Override
    public void customize(CodecConfigurer configurer) {
        configurer.customCodecs().register(new CloudEventHttpMessageReader());
        configurer.customCodecs().register(new CloudEventHttpMessageWriter());
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public RSocketStrategiesCustomizer cloudEventsCustomizer() {
        return strategies -> {
            strategies.encoder(new CloudEventEncoder());
            strategies.decoder(new CloudEventDecoder());
        };
    }

}
