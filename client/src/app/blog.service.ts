import {Injectable}     from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Blog}           from './Blog';
import {Observable}     from 'rxjs/Observable';
import {ChatRoom} from "./chatRoom";
import {User} from "./user";
import {ChatMessage} from "./chatMessage";

@Injectable()
export class BlogService {
    private postUserUrl = 'blog/addUser';  // URL to web API
    private postChatMessageUrl = 'blog/addChatMessage';
    private postRoomNameUrl = 'blog/addChatRoom';
    private getRoomsUrl = 'blog/getChatRooms';
    private getMessagesUrl = 'blog/getChatMessages';
    private getLoginCheckUrl = 'blog/getLoginCheck';

    constructor(private http: Http) {
    }

    /*
     * Check login
     * */
    checkLogin(userName: string): Observable<User> {
        let params = new URLSearchParams();
        params.set('userName', userName);

        let requestOptions = new RequestOptions();
        requestOptions.search = params;

        return this.http.get(this.getLoginCheckUrl, requestOptions)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Send RoomName to server
     * */

    addRoom(roomName: string): Observable<string> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        var params = {chatRoom: roomName};

        return this.http.post(this.postRoomNameUrl, params, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    addUser(userName: string): Observable<User> {
        let params = new URLSearchParams();
        params.set('userName', userName);

        let requestOptions = new RequestOptions();
        requestOptions.search = params;


        return this.http.post(this.postUserUrl, userName, requestOptions)
            .map(this.extractData)
            .catch(this.handleError);
    }


    /*
     * Get blog messages from server
     */
    getChatRooms(): Observable<ChatRoom[]> {
        return this.http.get(this.getRoomsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /*
     * Get blog messages from server
     */
    getChatMessages(chatRoom: string): Observable<ChatRoom[]> {
        let params = new URLSearchParams();
        params.set('chatRoom', chatRoom);

        let requestOptions = new RequestOptions();
        requestOptions.search = params;

        return this.http.get(this.getMessagesUrl, requestOptions)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /*
     * Send blog meassge to server
     */
    addBlog(blog: Blog): Observable<Blog> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        return this.http.post(this.postChatMessageUrl, blog, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Send chat message to server
     * */
    addChatMessage(chatMessage: ChatMessage, selectedRoom: string): Observable<ChatMessage> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        var params = {chatMessage: chatMessage, selectedRoom: selectedRoom};

        return this.http.post(this.postChatMessageUrl, params, options)
            .map(this.extractData)
            .catch(this.handleError);
    }


    /*
     * Data handlers
     */
    private extractData(res: Response) {
        let body = res.json();
        //console.log(body);
        return body || {};
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        //console.log(errMsg);
        return Observable.throw(errMsg);
    }
}
