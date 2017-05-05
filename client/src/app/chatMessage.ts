import {User} from "./user";
export class ChatMessage {
    constructor(public message: string, public sendTime: Date, public user: User,

    ) {
    }
}

