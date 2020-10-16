import { Component, OnDestroy, OnInit } from '@angular/core';
import { KafkaserviceService } from './kafkaservice.service';
import { FormControl, FormGroup } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import * as io from 'socket.io-client';
import { SelectorMatcher } from '@angular/compiler';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'Loans';

  messages = [];
  connection;
  message=['',null];
  error;
  val;
  form: FormGroup = new FormGroup({
    clientId: new FormControl(''),
    loanId: new FormControl(''),
    bname: new FormControl('')
  });
  private url = 'http://localhost:8092';
  private socket;
  datalist=[{"clientId":107,"loanno":234,"bname":"rakesh"},
          {"clientId":107,"loanno":235,"bname":"rashi"},
          {"clientId":107,"loanno":234,"bname":"ravi"},
          {"clientId":108,"loanno":134,"bname":"rudra"},
          {"clientId":108,"loanno":234,"bname":"shiva"},]
  displayedColumns: string[] = ['ClientId', 'Loan Number', 'Borrower Name'];
  dataSource = new MatTableDataSource<any[]>();
  constructor(private kf:KafkaserviceService){ }
  sendMessage(){
    this.kf.sendMessage(this.message);
    //this.message='';
  }
  ngOnInit(){
     // this.connection = this.kf.getLiveData1().subscribe(message => {
      //  this.messages.push(message);
      //console.log(this.kf.getLiveData1());
      //this.kf.getLiveData1().subscribe((data)=>this.messages=data);
       
      // this.connection=this.kf.getLiveData1().subscribe(message => {
      //    var ty=message["y"];
      //    Object.assign(this.val,JSON.parse(ty));
      //   //this.val=message;
      //   this.messages.push(message["y"]);
      //   message["y"] = +message["y"];
      //   //this.val=message["y"];
      //   console.log(this.val + "valyue");

      // })
      var arr=[];
        this.socket = io(this.url);
        this.socket.on('message', (data) => {
        // observer.next(data);
          this.val=data["y"];
          var str=this.val.split(" ");
          console.log("string"+str);
          arr=this.val.split(" ",3);
         // this.messages.push(this.val);
          this.messages.push(arr);
          this.message=str;
         console.log(this.val+"arr"+arr);
         //this.dataSource = new MatTableDataSource<any[]>(this.messages);
         if(this.message[0]!='')
            this.search();
      })
    }

    ngOnDestroy(){
      this.connection.unsubscribe();
    }    
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
      if (this.message[1]!=null) {
        flag = 1;
        elements2 = elements2.filter(res => res.loanno === parseInt(this.message[1]));
        console.log("loanid "+this.message[1]+" data  "+elements2);
      }
     console.log("data"+elements2);
     if (elements2.length == 0)
     this.error = "No Results found";
      this.dataSource = new MatTableDataSource<any[]>(elements2);

    }
  }
