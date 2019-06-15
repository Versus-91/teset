import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { from } from 'rxjs';
import { UnreadMessage } from '../unread-messages'
import { Message } from '../message';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public unreadMessages : UnreadMessage[]=[];
  public messages:Message[]=[];
  private hubConnection : signalR.HubConnection;
  public startConnection=(userId:number): Promise<{completed:boolean}>=>{
    return new Promise((resolve)=>{
      this.hubConnection = new signalR.HubConnectionBuilder().withUrl("http://localhost:17469/chathub?user="+userId).build();
      this.hubConnection.start()
      .then(()=>{console.log("connection started.");resolve({completed:true})}).catch((error)=>console.log(error))
    })
  }
  public sendTempMessgesListener(){
    this.hubConnection.on("receiveTempMessages",(data)=>{
      this.unreadMessages=data;
    })
  }
  public broadcastTempMessages(){
    this.hubConnection.invoke("SendTempMessages");
  }
  public conversationHistoryListener = () =>{
     this.hubConnection.on("ReceiveChatHistory",(records,chatid,operator,user)=>{
        this.messages = records;
     })
  }
  public deleteUserFromSideBar=()=>{
    this.hubConnection.on("chatAccepted",(userId)=>{
      let index = this.unreadMessages.findIndex(m=>m.id === userId);
      this.unreadMessages.splice(index,1);
    })
  }
  public broadcastStartConversation=(chatId : number , sender:number)=>{
         this.hubConnection.invoke("startConversation",chatId,sender);
  }
  public deleterPickedUserFromSidebar(){

  }
}
