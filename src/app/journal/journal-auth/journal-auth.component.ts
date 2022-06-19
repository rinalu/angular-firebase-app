import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
    selector: 'journal-auth',
    templateUrl: './journal-auth.component.html',
    styleUrls: ['../../../assets/scss/journal.scss'],
})

export class JournalAuthComponent {
    constructor(private afAuth: AngularFireAuth, private router:Router) {}

    login() {
        this.afAuth.signInAnonymously();
        this.afAuth.onAuthStateChanged(user => {
            this.router.navigate(['journal', 'edit']);
        });
    }
}
