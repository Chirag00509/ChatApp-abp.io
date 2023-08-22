export class MessageDto {
  id: any;
  senderId: string;
  receiverId: string;
  content: string;

  constructor() {
    this.senderId = '';
    this.receiverId = '';
    this.content = '';
    this.id = '';
  }
}
