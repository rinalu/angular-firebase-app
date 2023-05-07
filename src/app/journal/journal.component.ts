import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { stateChangeAnimation } from '../animations';
import { Auth, User, user } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
    selector: 'journal',
    templateUrl: './journal.component.html',
    styleUrls: ['../../assets/scss/journal.scss'],
    animations: stateChangeAnimation
})

export class JournalComponent {
    private auth: Auth = inject(Auth);
    user$ = user(this.auth);
    subscription: Subscription;
    userState = false;

    constructor(private router: Router, private route: ActivatedRoute) {
        this.subscription = this.user$.subscribe((user: User | null) => {
            if (user?.uid) {
                this.userState = true;
                this.router.navigate(['./edit'], {relativeTo: this.route})
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
