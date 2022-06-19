import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Firestore, collection, query, where, limit, updateDoc, doc, getDocs } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    redirectUrl: string;
    docId: string;
    usage: number;

    authenticated = false;
    constructor(private db: Firestore) {}

    getCompany(companyName: string): Observable<any> {
        const companyDataObservable = new Subject<any>();
        const companyData = query(
            collection(this.db, 'companies'), 
            where('name', '==', companyName.toLowerCase()), 
            limit(1));
        return companyDataObservable.pipe(
            switchMap(() => getDocs(companyData)),
            map(snapshot => {
                snapshot.forEach(e => {
                    const data: any = e.data();
                    const id = e.id;
                    this.usage = data.usage;
                    this.docId = id;
                    this.authenticated = true;
                    return { id, ...data }
                })
            })
        );
    }

    updateUsage(): void {
        if (this.authenticated) {
            updateDoc(doc(this.db, 'companies', this.docId), {
                usage: this.usage + 1
            });
        }
    }
}
