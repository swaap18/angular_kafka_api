  import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  //import { Observable } from 'rxjs/Observable';
  import * as io from 'socket.io-client';
  //import { BehaviorSubject } from '../../../node_modules/rxjs';
  
  @Injectable({
    providedIn: 'root'
  })
  export class KafkaserviceService {
    //private url = 'http://localhost:8092';
    private url='http://localhost:9000/kafka/message'
    private socket;
    private data;
   // value: BehaviorSubject<string> = new BehaviorSubject<string>();
    constructor() { }
  
  
    sendMessage(message) {
      this.socket.emit('add-message', message);
      console.log("MESSAGE SENT");
    }
  
    getLiveData1():Observable<any> {
      let mess;
      let observable= new Observable(observer => {
        this.socket = io(this.url);
        this.socket.on('message', (data) => {
         observer.next(data);
          mess=data;
         console.log(mess);
         //return mess;
        });
        return () => {
          this.socket.disconnect();
        }
      })
      return observable;
  // let obser=new Observable();
  //     this.socket = io(this.url);
  //    obser= this.socket.on('message')
  //   return obser;
    }
  
  //   getLiveData1() {
  //     let mess;
  //     //let observable = new Observable(observer => {
  //       this.socket = io(this.url);
  //       this.socket.on('message', (data) => {
  
  //        // observer.next(data);
  //        mess=data;
  //        console.log(mess);
  //       });
  //       // return () => {
  //       //   this.socket.disconnect();
  //       // }
  //  //   })
  //    // return observabl;
  //   }
  
  async getData():Promise<any>{
  // return this.httpclient.get(this.url,{responseType: 'text'});
   return this.data;
 }

 setData(message){
   this.data=message;
 }

}
