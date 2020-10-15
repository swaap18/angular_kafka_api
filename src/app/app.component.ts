import { Component, OnDestroy, OnInit } from '@angular/core';
import { KafkaserviceService } from './kafkaservice.service';
import { FormControl, FormGroup } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import * as io from 'socket.io-client';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'Loans';

  messages = [];
  connection;
  message;
  val;
  form: FormGroup = new FormGroup({
    clientId: new FormControl(''),
    loanId: new FormControl(''),
    bname: new FormControl('')
  });
  private url = 'http://localhost:8092';
  private socket;
  displayedColumns: string[] = ['ClientId', 'Loan Number', 'Borrower Name'];
  dataSource = new MatTableDataSource<any[]>();
  constructor(private kf:KafkaserviceService){ }
  sendMessage(){
    this.kf.sendMessage(this.message);
    this.message='';
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
         console.log(this.val+"arr"+arr);
         this.dataSource = new MatTableDataSource<any[]>(this.messages);

      })
    }

    ngOnDestroy(){
      this.connection.unsubscribe();
    }    
  }
