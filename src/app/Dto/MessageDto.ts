export class MessageDto {
  id: any;
  senderId: string;
  receiverId: string;
  content: string;
  groupId?: string;
  isGroup? : boolean;

  constructor() {
    this.senderId = '';
    this.receiverId = '';
    this.content = '';
    this.id = '';
    this.groupId = '';
    this.isGroup = false
  }
}
