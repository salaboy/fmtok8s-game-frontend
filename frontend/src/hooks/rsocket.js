
import {
    RSocketClient,
    JsonSerializer,
    IdentitySerializer
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';

let host = location.host;

export const rsocketClient = new RSocketClient({
    serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer
    },
    setup: {
        keepAlive: 5000,
        lifetime: 360000,
        dataMimeType: 'application/json',
        metadataMimeType: 'message/x.rsocket.routing.v0',
    },
    transport: new RSocketWebSocketClient({
        url: 'ws://' + host +'/ws/'
    }),
});