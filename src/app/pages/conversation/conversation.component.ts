import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { MessageDto } from 'src/app/Dto/MessageDto';
import { DatePipe } from '@angular/common';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainerRef!: ElementRef;

  private shouldScrollToBottom: boolean = false;
  private isLoadingMessages: boolean = false;
  private allMessagesLoaded: boolean = false;

  users: any;
  sortName: any
  allMessages: any[] = [];
  currentId: any;
  userId: any;
  userName: any;
  sendMessageForm!: FormGroup;
  selectedMessageId: number | null = null;
  isDropdownOpen = false;
  displyMessage: string = ''
  showMessageInput: string = ''
  editMessageId: number = 0;
  messageEdit: boolean = false;
  msgDto: MessageDto = new MessageDto();
  msgInboxArray: MessageDto[] = [];
  length: number = 0;
  count: number = 20;
  before: any;
  groupUserId: boolean = false;

  constructor(private userService: UserService, private datePipe: DatePipe, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    const currentDate = new Date();
    this.before = this.datePipe.transform(currentDate, 'dd/MM/yyyy HH:mm');
    this.route.params.subscribe(params => {
      this.currentId = params['id'];
      this.getUserList(this.currentId);
      this.showMessage(this.currentId);
    });
    this.chatService.retrieveMappedObject().subscribe((receivedObj: MessageDto) => {
      this.addToInbox(receivedObj);
      if (this.shouldScrollToBottom) {
        this.scrollToBottom();
        this.shouldScrollToBottom = true;
      }
    });
    this.initializeForm();
    this.msgInboxArray.forEach(message => {
      message.isGroup = this.isGroupMessage(message);
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  initializeForm() {
    this.sendMessageForm = this.formBuilder.group({
      message: new FormControl('', [Validators.required]),
    })
  }

  getControl(name: any): AbstractControl | null {
    return this.sendMessageForm.get(name);
  }

  isGroupMessage(message: any): boolean {
    return message.hasOwnProperty('groupId');
  }


  getUserList(id: any) {

    const jwtToken = localStorage.getItem('authToken');

    if (!jwtToken) {
      console.error('JWT Token not found in local storage');
      return;
    }
    const decodedToken: any = jwt_decode(jwtToken);

    this.userId = decodedToken.sub;
    this.userName = decodedToken.preferred_username;

    this.userService.getGroupName().subscribe((res) => {
      this.groupUserId = res.items.some((user: any) => user.id === this.currentId);
      if (!this.groupUserId) {
        this.userService.getName(id).subscribe((res) => {
          this.users = res.userName
        }, (error) => {
          if (error instanceof HttpErrorResponse) {
            const errorMessage = error.error.message;
            if (errorMessage === undefined) {
              alert("unauthorized access")
            } else {
              alert(errorMessage);
            }
          }
        })
      } else {
        this.userService.getGeoupNameById(id).subscribe((res) => {
          this.users = res.groupName
        })
      }
    })
  }

  showMessage(id: number) {
    this.userService.getGroupName().subscribe((res) => {
      this.groupUserId = res.items.some((user: any) => user.id == id);
      console.log(this.groupUserId);
      if (this.groupUserId) {
        this.userService.getGroupMessage(id).subscribe((res) => {
          console.log(res.items);

          this.shouldScrollToBottom = true;
          this.msgInboxArray = [];
          console.log(this.msgInboxArray);
          for (const message of res.items) {
            this.addToInbox(message);
          }
        })
      } else {
        this.userService.getMessage(id, this.count, this.before).subscribe((res) => {
          console.log(res);

          this.shouldScrollToBottom = true;
          this.msgInboxArray = [];
          console.log(this.msgInboxArray);
          for (const message of res.items) {
            this.addToInbox(message);
          }
        });
      }
      this.getMessages(this.msgInboxArray);
      this.allMessages = this.msgInboxArray.filter(
        (message) => message.senderId === this.userId || message.receiverId === this.userId
      );
    });
  }

  saveMessage(event: any, id: any) {
    event.preventDefault();
    this.userService.editMessage(id, this.displyMessage, this.userId, this.currentId).subscribe((res) => {
      this.msgDto = {
        content: res.content,
        receiverId: res.receiverId,
        id: res.id,
        senderId: res.senderId
      }
      this.chatService.broadcastEditedMessage(this.msgDto)
      alert("Message Successfully updated");
      this.messageEdit = false
    })
  }

  addToInbox(obj: MessageDto) {
    const messageExists = this.msgInboxArray.some((message) => message.id === obj.id);
    if (!messageExists) {
      this.msgInboxArray.push(obj);

      this.allMessages = this.msgInboxArray.filter(
        (message) => message.senderId === this.userId || message.receiverId === this.userId
      );
    }

  }
  cancelEdit(event: any) {
    event.preventDefault();
    this.messageEdit = false
  }

  sendMessages(data: any) {
    this.shouldScrollToBottom = true;
    let body;
    let user
    if (!this.groupUserId) {
      body = {
        "receiverId": this.currentId,
        "content": data.message,
        "senderId": this.userId,
      }
    } else {
      this.userService.getGroupUserList(this.currentId).subscribe((res) => {
        const users = res.items.filter((user: any) => user.userId != this.userId)
          .map((user: any) => ({
            "receiverId": user.userId,
            "content": data.message,
            "senderId": this.userId,
            "groupId": this.currentId,
          }));

        for (user of users) {
          this.userService.sendMesage(user).subscribe(async (res) => {
            this.msgDto = {
              content: res.content,
              receiverId: res.receiverId,
              id: res.id,
              senderId: res.senderId
            }
            this.chatService.broadcastMessage(this.msgDto)
            this.showMessageInput = ""

          }, (error) => {
            if (error instanceof HttpErrorResponse) {
              const errorMessage = error.error.message;
              alert(errorMessage);
            }
          })
        }
      });
    }
  }

  deleteMessage(id: any) {
    const isConfirmed = confirm("Are you sure you want to delete this message?");
    if (isConfirmed) {
      this.userService.getMessagesById(id).subscribe((res) => {
        if (res) {
          this.userService.deleteMessage(id).subscribe((message) => {
            this.msgDto = {
              content: res.content,
              receiverId: res.receiverId,
              id: res.id,
              senderId: res.senderId
            }
            this.chatService.broadcastDeletedMessage(this.msgDto);
            alert("Message Successfully updated");
          }, (error) => {
            if (error instanceof HttpErrorResponse) {
              const errorMessage = error.error.message;
              alert(errorMessage);
            }
          })
        }
      })
    }
  }

  editMessage(message: any) {
    this.displyMessage = message.content;
    this.editMessageId = message.id;
    this.messageEdit = true;
  }

  showDropdown(messageId: any) {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.selectedMessageId = this.selectedMessageId === messageId ? null : messageId;
  }

  getMessages(message: any) {
    this.chatService.updateMessage(message);
  }

  onChatScroll() {
    const scrollTop = this.chatContainerRef.nativeElement.scrollTop;

    if (this.allMessagesLoaded) {
      return;
    }

    if (scrollTop == 0 && !this.isLoadingMessages) {
      this.isLoadingMessages = true;
      this.count += 20;
      this.userService.getMessage(this.currentId, this.count, this.before).subscribe((res) => {

        if (res.items.length === 0) {
          this.shouldScrollToBottom = false;
          this.allMessagesLoaded = true;
        } else {
          for (const message of res.items) {
            this.addToInbox(message);
            this.shouldScrollToBottom = true;
          }
        }
        this.isLoadingMessages = false;


        if (this.shouldScrollToBottom) {
          this.chatContainerRef.nativeElement.scrollTop = this.chatContainerRef.nativeElement.scrollHeight;
        }
      })
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatContainerRef.nativeElement.scrollTop = this.chatContainerRef.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
