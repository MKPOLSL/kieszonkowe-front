import { HttpClient } from '@angular/common/http';
import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PocketMoneyService {
  private url: string = 'https://localhost:44353/pocketmoney';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.url);
  }
}
