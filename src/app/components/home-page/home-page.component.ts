import { Component, OnInit } from '@angular/core';
import { PocketMoneyService } from 'app/services/pocket-money.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  data: string[] = [];
  constructor(private service: PocketMoneyService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe((data) => (this.data = data));
  }
}
