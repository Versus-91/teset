import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signalr-service';
import { HttpClient } from '@angular/common/http';
import { UnreadMessage } from '../unread-messages'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userId:number = 3;
  message : string = ''

  constructor(public signalRService:SignalRService,private http:HttpClient ) {
    
   }

  ngOnInit() {
         this.signalRService.startConnection(this.userId).then(()=> this.signalRService.broadcastTempMessages())
         this.signalRService.sendTempMessgesListener();
         this.signalRService.conversationHistoryListener();
         this.signalRService.deleteUserFromSideBar()
  }

  public startConversation(chatId:number , sender:number):void {
    console.log("clicked"+ chatId)
    this.signalRService.broadcastStartConversation(chatId,sender);
  }
}
