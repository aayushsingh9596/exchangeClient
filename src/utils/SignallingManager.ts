export const BASE_URL = 'wss://ws.backpack.exchange';

interface IMessage {

}

export class SignallingManager {
    private ws: WebSocket;
    private static instance: SignallingManager;
    private bufferMessages: Array<IMessage>;
    private callbacks: any = {};
    private id: number;
    private initialized: boolean = false;

    private constructor() {
        this.ws = new WebSocket(BASE_URL);
        this.bufferMessages = []
        this.id = 1;
        this.init();
    }

    public static getInstance() {
        if (!this.instance)
            this.instance = new SignallingManager();
        return this.instance
    }

    init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferMessages.forEach(message => {
                this.ws.send(JSON.stringify(message));
            })
            this.bufferMessages = [];
        }
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const type = data?.stream?.toString()?.split('.')[0];
            console.log("type",type,"data",data);
            console.log(this.callbacks);
            if (type) {
                // const cbwithId = this.callbacks[type].find((callbackWithId: { cb: Function, id: string }) => callbackWithId.id === data.stream);
                // cbwithId.callback(data.data);
                for(let callbackWithId of this.callbacks[type])
                {
                    callbackWithId.callback(data.data);
                }
            }

        }
    }

    sendMessage(message: any) {
        const messageTobeSend = {
            ...message, id: this.id++
        }
        if (!this.initialized) {
            this.bufferMessages.push(messageTobeSend)
            return
        }
        this.ws.send(JSON.stringify(messageTobeSend))
    }

    async registerCallback(type: string, callback: Function, id: string) {
        if (!this.callbacks[type])
            this.callbacks[type] = [];
        const cbwithId = this.callbacks[type].find((callbackWithId: { cb: Function, id: string }) => callbackWithId.id === id);
        if(!cbwithId)
        this.callbacks[type].push({ callback, id })
        console.log("registed callbacks",this.callbacks);
    }
    public deregisterCallback(type: string, id: string) {
        if (this.callbacks[type]) {
            this.callbacks[type] = this.callbacks[type].filter((cb: { callback: Function, id: string }) => cb.id !== id);
        }
    }
}