import { Injectable } from '@angular/core';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { map, mergeMap, reduce, switchMap } from 'rxjs/operators';
import { collection, Firestore, getDocs, onSnapshot, orderBy, query, where } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class AboutService {
    skillList: any[] = [];
    experienceList: any[] = [];
    subscriptions: Subscription[] = [];

    constructor(private db: Firestore) {}

    getSkills(): void {
        if (this.skillList.length > 0)
            return;
        const skillDataObservable = new Subject<any>();
        skillDataObservable.pipe(
            switchMap(() =>
                getDocs(query(collection(this.db, 'skills'), where('type', '==', 'software'), orderBy('importance')))
            ),
            map(snapshot => snapshot.docs.map(e => {
                const data: any = e.data(); 
                return [data.tag, ...data.skills];
            }))
        );
        this.subscriptions.push(skillDataObservable.subscribe(result => this.skillList = result));
    }

    getExperiences():void {
        // do nothing if experienceList contains data
        if (this.experienceList.length > 0)
            return;
        const experienceDataObservable = new Subject<any>();
        const detailDataObservable = new Subject<any>();
        detailDataObservable.pipe(
            switchMap(() =>
                getDocs(query(collection(this.db, 'details'), orderBy('rank')))
            ));
        experienceDataObservable.pipe(
            switchMap(() =>
                getDocs(query(collection(this.db, 'experiences'), orderBy('importance')))
            ),
            mergeMap(snapshot => {
                let exps = snapshot.docs.map(doc => {
                    let data: any = doc.data();
                    data.start_date = new Date(data.start_date.seconds*1000);
                    data.end_date = new Date(data.end_date.seconds*1000);
                    return { id: doc.id, ...data, details: [] };
                });
                return detailDataObservable.pipe(
                    map(snapshot => snapshot.docs.map((doc: any) => {
                        const parent = doc.ref.parent.parent.id;
                        const detail = doc.data().detail;
                        return { parent, detail };
                    })),
                    reduce((acc, cur: any) => {
                        const id = cur.parent;
                        const index = acc.findIndex(e => e.id === id);
                        if (~index) {
                            acc[index].details.push(cur.detail);
                        }
                        return acc;
                    }, exps)
                )
            })
        );
        this.subscriptions.push(experienceDataObservable.subscribe(result => this.experienceList = result));
        // let expSub = this.db.collection('experiences', ref => ref.orderBy('importance')).get()
        //     .pipe(mergeMap(snapshot => {
        //         let exps = snapshot.docs.map(doc => {
        //             let data: any = doc.data();
        //             data.start_date = new Date(data.start_date.seconds*1000);
        //             data.end_date = new Date(data.end_date.seconds*1000);
        //             return { id: doc.id, ...data, details: [] };
        //         });
        //         return this.db.collectionGroup('details', ref => ref.orderBy('rank')).get()
        //             .pipe(map(snapshot =>
        //                 snapshot.docs.map((doc: any) => {
        //                     const parent = doc.ref.parent.parent.id;
        //                     const detail = doc.data().detail;
        //                     return { parent, detail };
        //                 }).reduce((acc, cur) => {
        //                     const id = cur.parent;
        //                     const index = acc.findIndex(e => e.id === id);
        //                     if (~index) {
        //                         acc[index].details.push(cur.detail);
        //                     }
        //                     return acc;
        //                 }, exps)
        //             ));
        //         }),
        //     ).subscribe((res: any) => this.experienceList = res);
        // this.subscriptions.push(expSub);
    }
}
