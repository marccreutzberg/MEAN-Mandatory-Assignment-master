import {Component} from '@angular/core';
import {Blog} from './blog';
import {Http, Response} from '@angular/http';
import './rxjs-operators';
import {BlogService} from "./blog.service";
import {User} from "./user";
import {ChatMessage} from "./chatMessage";
import * as io from 'socket.io-client';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [BlogService]
})
export class AppComponent {
    chatMessage = "";
    user = new User("");
    isLoggedIn: boolean = false;
    showRegister: boolean = false;
    showLogin: boolean = true;
    roomIsSelected: boolean = false;
    title = 'Wellcome to chat app';
    selectedRoom = "";
    roomName = "";
    public chatMessages = [];
    public chatRooms = [];
    private socket = null;
    private url = window.location.origin;

    constructor(private blogService: BlogService) {
    }

    submitLogin() {
        console.log(this.user);
        var User = this.blogService.checkLogin(this.user.userName).subscribe(
            user => {
                if (user != null) {
                    this.isLoggedIn = true;
                    this.getChatRooms();

                    var parameters = {userName: this.user.userName, rooms: this.chatRooms};
                    this.socket = io(this.url);
                    this.socket.connect();
                    this.socket.emit('addUser', parameters);
                }
                else {
                    this.isLoggedIn = false;
                }
            },
        );
    }

    submitRegister() {
        var User = this.blogService.addUser(this.user.userName).subscribe(
            user => {
                if (user != null) {
                    this.isLoggedIn = true;
                    this.showRegister = false;
                    this.getChatRooms();
                }
                else {
                    this.isLoggedIn = false;
                }
            },
        );
    }

    submitMessage() {
        let sendTime = Date.now();
        let date = new Date(sendTime);
        let chatMessage = new ChatMessage(this.chatMessage, date, this.user);
        this.blogService.addChatMessage(chatMessage, this.selectedRoom)
            .subscribe(
                chatMsg => {
                    this.getMessages(this.selectedRoom);
                    this.chatMessage = "";
                    this.socket.emit('chat message', chatMessage);
                },
                error => this.title = <any>error
            );
    }

    submitLogout() {
        this.socket.disconnect();
        this.showLogin = true;
        this.isLoggedIn = false;
        this.roomIsSelected = false;
    }

    getChatRooms() {
        this.blogService.getChatRooms().subscribe(
            chatRooms => {
                console.log("Rooms:", chatRooms);
                this.chatRooms = chatRooms;
            },
            error => this.title = <any>error
        );
    }

    chooseRoom(chatRoom) {
        var parameters = {room: chatRoom.name};
        this.socket.emit('chooseRoom', parameters);
        this.blogService.getChatMessages(chatRoom.name).subscribe(
            chatMessages => {
                this.chatMessages = chatMessages;
                this.roomIsSelected = true;
                this.selectedRoom = chatRoom.name;
            },
            error => this.title = <any>error
        );
    }

    getMessages(chatRoom) {
        this.blogService.getChatMessages(chatRoom).subscribe(
            chatMessages => {
                console.log("ChatMessages:", chatMessages);
                this.chatMessages = chatMessages;
            },
            error => this.title = <any>error
        );
    }

    register() {
        this.showRegister = true;
        this.showLogin = false;
    }

    login() {
        this.showRegister = false;
        this.showLogin = true;
    }

    createRoom() {
        this.blogService.addRoom(this.roomName)
            .subscribe(
                chatRoom => {
                    this.roomName;
                    this.getChatRooms();
                    this.socket.emit('update rooms');
                },
                error => this.title = <any>error
            );
    }

    ngOnInit() {
        this.getChatRooms();
        this.socket = io(this.url);
        this.socket.on('send message', function (parameters) {
            if(this.selectedRoom == parameters.chatRoom) {
                this.chatMessages.push(parameters.chatMessage);
            }
        }.bind(this));
        this.socket.on('get rooms', function(){
            this.getChatRooms();
        }.bind(this));
    }

}
