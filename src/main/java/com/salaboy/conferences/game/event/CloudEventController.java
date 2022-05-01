package com.salaboy.conferences.game.event;

import io.cloudevents.CloudEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("cloudevents")
public class CloudEventController {

    private static final Logger log = LoggerFactory.getLogger(CloudEventController.class);

    @PostMapping
    void addEvent(@RequestBody CloudEvent cloudEvent) {
        log.info("Event received. Id: {}, type: {}.", cloudEvent.getId(), cloudEvent.getType());
    }

}
