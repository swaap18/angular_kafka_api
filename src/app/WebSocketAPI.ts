import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

import { AppComponent } from './app.component';
import { KafkaserviceService } from './kafkaservice.service';
import { Subject } from 'rxjs';

export class WebSocketAPI {
    webSocketEndPoint: string = 'http://localhost:9000/ws';
    topic: string = "/topic/greetings";
    stompClient: any;
    appComponent: AppComponent;
    kf:KafkaserviceService
    public configObservable = new Subject<number>();

emit(val) {
  this.configObservable.next(val);
}
    constructor(appComponent: AppComponent,kf:KafkaserviceService){
        this.appComponent = appComponent;
        this.kf=kf;
    }
  _connect(){
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        console.log("in connect")
         _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
            // var message= sdkEvent;
            // console.log(message.body);
            // return message.body;
            _this.onMessageReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

	/**
	 * Send message to sever via web socket
	 * @param {*} message 
	 */
    _send(message) {
        console.log("calling logout api via web socket");
        this.stompClient.send("/app/hello", {}, JSON.stringify(message));
    }

    onMessageReceived(message) {
        console.log("Message Recieved from Server :: " + message);
        this.emit(message);
    }
}