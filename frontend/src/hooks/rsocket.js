import {
    RSocketClient,
    JsonSerializer,
    IdentitySerializer
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';

let host = location.host;
//let host = "game-frontend.default.34.116.208.197.sslip.io"

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
        url: 'ws://' + host + '/ws/'
    }),
});

class MyRSocketClient {

    constructor() {
        console.log("constructor")
        this.connect()
    }

    socket = null;

    connect() {
        rsocketClient.connect().subscribe({
            onComplete: socket => {
                this.socket = socket
                console.log("connection established: " + socket)
                socket.connectionStatus().subscribe(event => {
                    if (event.kind !== 'CONNECTED') {
                        this.socket = null;
                        this.connect();
                    }
                });
            },
            onError: error => {
                reject(error);
                this.connect();
                console.log("RSocket connection refused due to: " + error);
            },
            onSubscribe: cancel => {
                /* call cancel() to abort */
            }

        });

    }

}

export const rsocketClientInstance = new MyRSocketClient();