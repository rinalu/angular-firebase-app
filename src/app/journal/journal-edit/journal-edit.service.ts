import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Firestore, collection, doc, CollectionReference, getDocs, addDoc, deleteDoc, updateDoc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class JournalEditService {
    sessionTasks: any[] = [];
    subscriptions: Subscription[] = [];

    private uid: string = '';
    private collectionRef: CollectionReference<any>;
    constructor(private db: Firestore) {}

    async getTasks(uid: string): Promise<Observable<any[]>> {
        this.uid = uid;
        const currentUserNoteRef = doc(collection(this.db, 'notes'), uid);
        const currentUserNotes = await getDoc(currentUserNoteRef);

        if (currentUserNotes.exists()) {
            this.collectionRef = collection(currentUserNoteRef, 'tasks');

            const taskDataObservable = new Subject<any>();
            taskDataObservable.pipe(
                switchMap(() => getDocs(this.collectionRef)),
                map((task: any) => ({ docId: task.id, ...task.data() }))
            );
            this.subscriptions.push(taskDataObservable.subscribe(res => this.sessionTasks = res));
            return taskDataObservable;

        } else {
            this.createNewNoteCollectionForUser();
        }
    }

    async createNewNoteCollectionForUser(): Promise<void> {
        const notesCollection = collection(this.db, 'notes');
        await setDoc(doc(notesCollection, this.uid), {});
        this.collectionRef = collection(doc(notesCollection, this.uid), 'tasks');
    }

    removeTask(i:number, docId:any): void {
        this.sessionTasks.splice(i, 1);
        // if task has id, remove from database as well
        if (docId) {
            deleteDoc(doc(this.collectionRef, docId));
        }
    }

    updateTask(id:string, obj:any): void {
        updateDoc(doc(this.collectionRef, id), obj);
    }

    saveTask(text:string): void {
        const newTask = {
            created_by: this.uid,
            task: text,
            timestamp: new Date(),
            accomplished: false,
        }
        addDoc(this.collectionRef, newTask);
    }

    addEmptyTask(): void {
        this.sessionTasks.push({
            task: ''
        });
    }
}
