import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(data: any): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      "userName": data.name,
      "emailAddress": data.email,
      "password": data.password,
      "appName": "ChatApp"
    }

    return this.http.post<any>("https://localhost:44389/api/account/register", body, { headers: headers })
  }

  login(data: any): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>("https://localhost:44389/connect/token",
      "username=" + data.email +
      "&password=" + data.password +
      "&grant_type=password" +
      "&client_id=ChatApp_App&scope=openid offline_access ChatApp",
      { headers: headers })
  }

  userList(): Observable<any[]> {

    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>("https://localhost:44389/api/app/user/details", { headers: headers });
  }

  getMessage(id: any, count: number, before: any): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`https://localhost:44389/api/app/message-custom/messages/${id}`, { headers: headers });
  }

  sendMesage(body: any): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>("https://localhost:44389/api/app/message", body, { headers: headers })
  }

  deleteMessage(id: any): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<any>(`https://localhost:44389/api/app/message/${id}`, { headers: headers });

  }

  editMessage(id: number, message: string, senderId: any, receiverId: any): Observable<any> {

    const body = {
      "content": message,
      "senderId": senderId,
      "receiverId": receiverId
    }
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`https://localhost:44389/api/app/message/${id}`, body, { headers: headers });
  }

  VerifyToken(tokenId: string): Observable<any> {

    const body = {
      "TokenId": tokenId
    }
    return this.http.post<any>("https://localhost:7223/api/SocialLogin", body)
  }

  searchHistory(result: any): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`https://localhost:44389/api/app/message-custom/search-result?result=${result}`, { headers: headers })
  }

  getName(id: string): Observable<any> {

    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`https://localhost:44389/api/identity/users/${id}`, { headers: headers })
  }

  getMessagesById(id: any): Observable<any> {
    return this.http.get<any>(`https://localhost:44389/api/app/message/${id}`)
  }

  groupName(data: any) : Observable<any> {

    const body = {
      "groupName" : data.groupName
    }

    return this.http.post<any>("https://localhost:44389/api/app/group", body);
  }

  insertGroupId(data: any) : Observable<any> {
    return this.http.post<any>("https://localhost:44389/api/app/group-user-app-servicecs", data)
  }

  getGroupName() : Observable<any> {
    return this.http.get<any>("https://localhost:44389/api/app/group")
  }

  getGroupUserList(id: string) : Observable<any> {
    return this.http.get<any>(`https://localhost:44389/api/app/custom-group-user/user/${id}`);
  }

  getGeoupNameById(id: any) :Observable<any> {
    return this.http.get<any>(`https://localhost:44389/api/app/group/${id}`);
  }

  getAllGroupUserList() : Observable<any> {
    return this.http.get<any>("https://localhost:44389/api/app/group-user-app-servicecs")
  }

  getGroupMessage(id: any): Observable<any> {
    return this.http.get<any>(`https://localhost:44389/api/app/message-custom/messages-by-group-id/${id}`);
  }

}
