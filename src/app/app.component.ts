import { Component, OnChanges, OnDestroy, OnInit,SimpleChange,ViewChild  } from '@angular/core';
import { KafkaserviceService } from './kafkaservice.service';
import { FormControl, FormGroup } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import * as io from 'socket.io-client';
import { SelectorMatcher } from '@angular/compiler';
import { WebSocketAPI } from './WebSocketAPI';
import { Input } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  webSocketEndPoint: string = 'http://localhost:9000/ws';
  topic: string = "/topic/greetings";
  title = 'Loans';
  webSocketAPI: WebSocketAPI;
  greeting: any;
  name: string;
  messages = [];
  connection;
  cl:string="";
 // @Input('ngModel')
  message;
  error;
  val;
  a:string="";
  b:string="";
  form: FormGroup = new FormGroup({
    clientId: new FormControl(this.a),
    loanId: new FormControl(this.b),
    bname: new FormControl('')
  });
  //private url = 'http://localhost:8092';
  private url='http://localhost:9000/kafka/message'
  private socket;
  datalist=[{"clientId":107,"loanno":235,"bname":"rakesh"},
          {"clientId":107,"loanno":234,"bname":"rashi"},
          {"clientId":107,"loanno":234,"bname":"swapnil"},
          {"clientId":108,"loanno":134,"bname":"rudra"},
          {"clientId":108,"loanno":234,"bname":"shiva"},
          {"clientId":12083,"loanno":121212,"bname":"jasmin"}
        ]
  displayedColumns: string[] = ['ClientId', 'Loan Number', 'Borrower Name'];
  dataSource = new MatTableDataSource<any[]>();
  constructor(){
   }
  // sendMessage(){
  //   this.kf.sendMessage(this.message);
  //   //this.message='';
  // }

  async ngOnInit() {
    this.webSocketAPI = new WebSocketAPI(new AppComponent(),new KafkaserviceService());
     this.webSocketAPI._connect();
    this.webSocketAPI.configObservable.subscribe(data=>{this.message=data;console.log(this.message);this.handleMessage(this.message.body)});

};
  // ngOnInit(){
  //    // this.connection = this.kf.getLiveData1().subscribe(message => {
  //     //  this.messages.push(message);
  //     //console.log(this.kf.getLiveData1());
  //     //this.kf.getLiveData1().subscribe((data)=>this.messages=data);
       
  //     // this.connection=this.kf.getLiveData1().subscribe(message => {
  //     //    var ty=message["y"];
  //     //    Object.assign(this.val,JSON.parse(ty));
  //     //   //this.val=message;
  //     //   this.messages.push(message["y"]);
  //     //   message["y"] = +message["y"];
  //     //   //this.val=message["y"];
  //     //   console.log(this.val + "valyue");

  //     // })
  //     var arr=[];
  //      // this.socket = io(this.url);
  //      // this.socket.on('message', (data) => {
  //       // observer.next(data);
  //       this.kf.getData().subscribe(data=>{
  //         data=data.toString();
  //         this.val=data;
  //         var str=this.val.split(" ");
  //         console.log("string"+str);
  //         arr=this.val.split(" ",3);
  //        // this.messages.push(this.val);
  //         this.messages.push(arr);
  //         this.message=str;
  //        console.log(this.val+"arr"+arr);
  //        //this.dataSource = new MatTableDataSource<any[]>(this.messages);
  //        if(this.message[0]!='')
  //           this.search();
  //     })
  //   }
  
    search(){
      
     this.error=null;
      var flag = 0;
      var elements = this.datalist;
      var elements2;
      if (this.message[0]!='') {
        flag = 1;
        elements2 = elements.filter(res => res.clientId=== parseInt(this.message[0]));
        console.log("clientid "+this.message[0]+" data  "+elements2);
      }
      if (this.message[1]!='') {
        flag = 1;
        elements2 = elements2.filter(res => res.loanno === parseInt(this.message[1]));
        console.log("loanid "+this.message[1]+" data  "+elements2);
      }
     console.log(elements2);
     if (elements2.length == 0)
     this.error = "No Results found";
      this.dataSource = new MatTableDataSource<any[]>(elements2);

    }
  



  connect(){
    this.webSocketAPI._connect();
  }

  disconnect(){
    this.webSocketAPI._disconnect();
  }

  sendMessage(){
    this.webSocketAPI._send(this.name);
  }

  handleMessage(message){
    this.greeting = message;

   var data=message;
    var arr=[];
          this.val=JSON.parse(message);
          //var str=this.val.split(" ");
          //console.log("string"+str);
         // arr=this.val.split(",");
         // this.messages.push(this.val);
         // this.messages.push(arr);
         // this.message=str;
         // console.log(str[0]+"ff"+str[1]);
         //console.log(this.val+"arr"+arr);
         //this.a=str[0];
        // this.b=str[1];
        this.a=this.val["clientId"];
        this.b=this.val["loanNumber"];
        this.message[0]=this.a;
        this.message[1]=this.b;
        console.log(this.form.value+" a"+this.a+this.b);
         //this.dataSource = new MatTableDataSource<any[]>(this.messages);
            this.search();
    
  }
}