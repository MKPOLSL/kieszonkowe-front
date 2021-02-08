import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ChildrenService } from '@app/services/children.service';


@Component({
    selector: 'list',
    templateUrl: 'list.component.html',
    styleUrls: ['./child.component.scss'],
  })
export class ListComponent implements OnInit {
    users = null;
    childs = null;
    loading: any = true;

    constructor(private childrenService: ChildrenService) {}

    ngOnInit() {
        
        let user = JSON.parse(localStorage.getItem('user'))
        this.childrenService.getChildren(user.id)
            .pipe(first())
            .subscribe(
                childs => {
                    this.childs = childs
                    this.loading = false},
                errors => {
                    this.loading = false
                });

    } 
}