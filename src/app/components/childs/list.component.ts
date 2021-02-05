import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/services';


@Component({
    selector: 'list',
    templateUrl: 'list.component.html',
    styleUrls: ['./child.component.scss'],
  })
export class ListComponent implements OnInit {
    users = null;
    childs = null;
    loading: any = true;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        
        let user = JSON.parse(localStorage.getItem('user'))
        this.accountService.getChildren(user.id)
            .pipe(first())
            .subscribe(childs => {
                this.childs = childs
                this.loading = false});
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id) 
            });
    }
}