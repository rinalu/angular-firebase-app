import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

import { AuthService } from './auth.service';

@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['../../assets/scss/auth.scss']
})

export class AuthComponent {
    @ViewChild('authModal', {static: true}) private authModal;

    faQuestionCircle = faQuestionCircle;
    companyName: string;
    explainText: string;
    modalInstance: any;
    items: Observable<any[]>;
    subscriptions: Subscription[] = [];
    constructor(
        private authService: AuthService, private db: Firestore,
        private modalService: NgbModal, public router: Router
    ) {
        this.explainText = "This authentication is used to limit access to \
            resume view to companies only, while the content matches exactly\
            with the submitted application."
    }

    ngOnInit() {
        this.modalInstance = this.modalService.open(this.authModal, {
            centered: true,
            keyboard: false,
            backdrop: 'static'
        });
    }

    login() {
        let sub = this.authService.getCompany(this.companyName).subscribe({
            next: (res: any[]) => {
                if (this.authService.authenticated) {
                    let redirectUrl = this.authService.redirectUrl ?
                    this.router.parseUrl(this.authService.redirectUrl) : '/home';

                    this.modalInstance.close();
                    this.router.navigateByUrl(redirectUrl);
                }
            },
            complete: () => {
                this.authService.updateUsage();
            }
        });
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.map(s => s.unsubscribe());
    }
}
