import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  serchForm!: FormGroup
  createGroupForm!: FormGroup
  searchResult = false;
  userIdList: any[] = [];
  isNestedPopupOpen: boolean = false;
  groupName: string = '';
  userList: any[] = [];
  groupList: any[] = [];
  currentUserId: any;
  userIdExists: boolean = false;
  currentId: any;


  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentId = params['id'];
    });
    this.getGroupName();
    this.getCurrentUser();
    this.getUserList();
    this.initializeForm();
  }

  initializeForm() {
    this.serchForm = this.formBuilder.group({
      search: new FormControl('', [Validators.required]),
    });

    this.createGroupForm = this.formBuilder.group({
      groupName: new FormControl('', [Validators.required]),
      users: new FormControl('', [Validators.required])
    });
  }

  getControl(form: FormGroup, name: any): AbstractControl | null {
    return form.get(name);
  }

  getCurrentUser() {
    const jwtToken = localStorage.getItem('authToken');
    if (!jwtToken) {
      console.error('JWT Token not found in local storage');
      return;
    }
    const decodedToken: any = jwt_decode(jwtToken);
    this.currentUserId = decodedToken.sub;
  }

  getUserList() {
    this.userService.userList().subscribe((res: any) => {
      this.userList = res.items;
    }, (error) => {
      if (error instanceof HttpErrorResponse) {
        const errorMessage = error.error.message;
        if (errorMessage === undefined) {
          alert("unauthorized access");
          this.router.navigateByUrl("/login")
        } else {
          alert(errorMessage);
        }
      }
    })
  }

  isGroupMessage(message: any): boolean {
    return message.hasOwnProperty('groupId'); // Adjust this based on your data structure
  }

  getGroupName() {
    this.userService.getAllGroupUserList().subscribe((res: any) => {
      this.userIdExists = res.items.some((user: any) => user.userId === this.currentUserId);

      if(this.userIdExists) {
        this.userService.getGroupName().subscribe((res: any) => {
          this.groupList = res.items;
        })
      }
    })
  }

  showMessage(id: any) {
    this.router.navigate(['/chat', { outlets: { childPopup: ['user', id] } }]);
  }

  search(data: any) {
    this.searchResult = true;
    this.router.navigate(['/chat', { outlets: { childPopup1: ['search', data.search] } }])
  }

  openGroupPopup() {
    this.isNestedPopupOpen = true;
  }

  closeNestedPopup() {
    this.isNestedPopupOpen = false;
  }

  createGroup(data: any) {
    this.closeNestedPopup();
    this.userService.groupName(data).subscribe((res) => {
      const seletectedUser = this.userList.filter(x => x.selected == true).map(x => x.id).join(",").toString();

      const selectedUserIdsArray = seletectedUser.split(",");

      const userListWithIds = selectedUserIdsArray.map((userId: any) => {
        return { groupId: res.id, userId: userId };
      });

      userListWithIds.push({ groupId: res.id, userId: this.currentUserId });

      console.log(userListWithIds);

      for (const userObj of userListWithIds) {
        this.userService.insertGroupId(userObj).subscribe((res) => {
        })
      }
      alert("Group Create successfully");
    })
  }
}
