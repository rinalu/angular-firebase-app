import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot, RouterStateSnapshot, Router
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first, from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JournalAuthGuard implements CanActivate {
    constructor(private afAuth: AngularFireAuth, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
            let url: string = state.url;
            return this.checkAuth(url);
    }

    checkAuth(url: string): Observable<boolean> {
        const userStatePromise = this.afAuth.currentUser.then((user) => {
            return user == null ? false : true;
        });
        return from(userStatePromise).pipe(first((userState) => {
            if (!userState) {
                this.router.navigate(['journal']);
            }
            return userState;
        }));
    }
}
