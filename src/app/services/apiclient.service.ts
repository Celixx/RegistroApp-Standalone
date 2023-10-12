import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiclientService {

  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    })
  };

  url = 'https://jsonplaceholder.typicode.com'

  constructor(private http: HttpClient) {

  }

  getUsuario(userId: number): Observable<any> {
    return this.http.get(this.url + '/users/' + userId).pipe(
      retry(3)
    );
  }

  getUsuarios(): Observable<any> {
    return this.http.get(this.url + '/users/').pipe(
      retry(3)
    );
  }

  getPosts(): Observable<any> {
    return this.http.get(this.url + '/posts/').pipe(
      retry(3)
    );
  }

  createPost(post: any): Observable<any> {
    return this.http.post(this.url + '/posts/', post, this.httpOptions).pipe(
      retry(3)
    );
  }

  updatePost(post: any): Observable<any> {
    return this.http.put(this.url + '/posts/' + post.id, post, this.httpOptions)
      .pipe(retry(3)
    );
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(this.url + '/posts/' + postId, this.httpOptions).pipe(
      retry(3)
    );
  }
}
