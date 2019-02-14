import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionnairsService {

  constructor(private http: HttpClient) { }

  getQuestionnaires() {
    return this.http.get('/qs/');
  }

  getQuestion(qID: number, tokenID?: string) {

    let requestUrl;
    if (tokenID) {
      requestUrl = `/qs/${qID}?key=${tokenID}`;
    } else {
      requestUrl = `/qs/${qID}/`;
    }

    return this.http.get(requestUrl);
  }

  sendPath(data) {
    return this.http.post('/log/', data);
  }
}
