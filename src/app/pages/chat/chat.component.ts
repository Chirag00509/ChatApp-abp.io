import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  users: any[] = [];
  serchForm!: FormGroup
  searchResult = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.getUserList();
    this.initializeForm();
  }

  initializeForm() {
    this.serchForm = this.formBuilder.group({
      search: new FormControl('', [Validators.required]),
    })
  }

  getControl(name: any): AbstractControl | null {
    return this.serchForm.get(name);
  }

  getUserList() {
    this.userService.userList().subscribe((res : any) => {
      this.users = res.items;
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

  showMessage(id: any) {
    this.router.navigate(['/chat', { outlets: { childPopup: [ 'user', id ] }}]);
  }

  search(data: any) {
    this.searchResult = true;
    this.router.navigate(['/chat', { outlets: { childPopup1: [ 'search', data.search ] }}])
  }
}
