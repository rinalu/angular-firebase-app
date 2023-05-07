import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-regular-svg-icons'

import { JournalEditService } from './journal-edit.service';

@Component({
    selector: 'journal-edit',
    templateUrl: './journal-edit.component.html',
    styleUrls: ['../../../assets/scss/journal.scss']
})

export class JournalEditComponent {
    faPlus = faPlus;
    faSave = faSave;
    faTrashAlt = faTrashAlt;

    tasksSaved$: Observable<any[]>;
    constructor(public journalEditService:JournalEditService, private afAuth: AngularFireAuth) {
        afAuth.currentUser.then((user) => {
            if (user)
                this.getUserTasks(user.uid);
        });
    }

    async getUserTasks(uid:string) {
        if (this.journalEditService.sessionTasks.length === 0)
            this.tasksSaved$ = await this.journalEditService.getTasks(uid);
    }

    markDone(docId:string) {
        const data = {
            accomplished: true
        }
        this.journalEditService.updateTask(docId, data);
    }

    saveBlock(input:any) {
        const docId = input.docId;
        if (docId) {
            const obj = {
                task: input.task
            }
            this.journalEditService.updateTask(docId, obj);
        } else {
            this.journalEditService.saveTask(input.task);
        }
    }

    addNewBlock() {
        this.journalEditService.addEmptyTask();
    }

    deleteBlock(i:number, docId:any) {
        console.log(docId);
        this.journalEditService.removeTask(i, docId);
    }

    trackByFn(index:number, item:any) {
        return index;
    }

    ngOnDestroy() {
        this.journalEditService.subscriptions.map(s => s.unsubscribe());
    }
}
