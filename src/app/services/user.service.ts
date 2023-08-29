import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  baseURL = "https://localhost:44373/api"

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

    return this.http.post<any>(this.baseURL +"/account/register", body, { headers: headers })
  }

  login(data: any): Observable<any> {

    const body = {
      "userNameOrEmailAddress": data.email,
      "password": data.password,
      "rememberMe": true
    }

    return this.http.post<any>(this.baseURL + "/account/login", body)
  }

  generateToken(data: any): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>("https://localhost:44373/connect/token",
      "username=" + data.email +
      "&password=" + data.password +
      "&grant_type=password" +
      "&client_id=ChatAppss_App&scope=openid offline_access ChatAppss",
      { headers: headers })
  }

  userList(): Observable<any[]> {

    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(this.baseURL + "/app/user/details", { headers: headers });
  }

  getMessage(id: any, count: number, before: any): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(this.baseURL + `/app/message-custom/messages/${id}`, { headers: headers });
  }

  sendMesage(body: any): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(this.baseURL + "/app/message-custom/message", body, { headers: headers })
  }

  deleteMessage(id: any): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<any>(this.baseURL +`/app/message/${id}`, { headers: headers });

  }

  editMessage(id: number, body: any): Observable<any> {


    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(this.baseURL +`/app/message/${id}`, body, { headers: headers });
  }

  searchHistory(result: any): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(this.baseURL + `/app/message-custom/search-result?result=${result}`, { headers: headers })
  }

  getName(id: string): Observable<any> {

    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(this.baseURL +  `/identity/users/${id}`, { headers: headers })
  }

  getMessagesById(id: any): Observable<any> {
    return this.http.get<any>(this.baseURL + `/app/message/${id}`)
  }

  groupName(data: any) : Observable<any> {

    const body = {
      "groupName" : data.groupName
    }

    return this.http.post<any>(this.baseURL + "/app/group", body);
  }

  insertGroupId(data: any) : Observable<any> {
    return this.http.post<any>(this.baseURL + "/app/group-user-app-servicecs", data)
  }

  getGroupName() : Observable<any> {
    return this.http.get<any>(this.baseURL + "/app/group")
  }

  getGroupUserList(id: string) : Observable<any> {
    return this.http.get<any>(this.baseURL + `/app/custom-group-user/user/${id}`);
  }

  getGeoupNameById(id: any) :Observable<any> {
    return this.http.get<any>(this.baseURL + `/app/group/${id}`);
  }

  getAllGroupUserList() : Observable<any> {
    return this.http.get<any>(this.baseURL + "/app/group-user-app-servicecs")
  }

  getGroupMessage(id: any): Observable<any> {
    return this.http.get<any>(this.baseURL + `/app/message-custom/messages-by-group-id/${id}`);
  }

}
