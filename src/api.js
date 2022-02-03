export let socket = null

const cleanUp = () => {
    socket?.removeEventListener('close', closeHendler);
    socket?.removeEventListener('open', openHandler);
    socket?.removeEventListener('error', errorHandler);
};

export const connectWS = () => {
    cleanUp();
    closeWS();
    socket = new WebSocket(`wss://ws.blockchain.info/inv`);
    socket.addEventListener('close', closeHendler);
    socket.addEventListener('open', openHandler);
    socket.addEventListener('error', errorHandler);
}

const sendToWebSocket = (message) => {
    const stringifiedMessage = JSON.stringify(message);
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMessage);
    }
}

const closeHendler = (event) => {
    if (!event.wasClean) {
        console.log('Close WS with Error, connect WS again');
        setTimeout(() => {
            connectWS();
        }, 3000);
    } else {
        console.log('close WS clean');
    }
}

const openHandler = () => {
    console.log('open WS');
}

const errorHandler = (e) => {
    console.log("Error WS", e);
}

export const closeWS = () => {
    socket?.close();
}

export const subscribeToTransactionsOnWs = () => {
    sendToWebSocket({
        op: "unconfirmed_sub"
    });
};

export const unsubscribeFromTransactionsOnWs = () => {
    sendToWebSocket({
        op: "unconfirmed_unsub"
    });
};
