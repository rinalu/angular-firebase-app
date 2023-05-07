import { inject, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { 
    Firestore, 
    collection, 
    doc, 
    CollectionReference, 
    addDoc, 
    deleteDoc, 
    updateDoc, 
    getDoc, 
    setDoc, 
    collectionData
} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class JournalEditService {
    sessionTasks: any[] = [];
    subscriptions: Subscription[] = [];

    private uid: string = '';
    private collectionRef: CollectionReference<any>;
    private firestore: Firestore = inject(Firestore);

    async getTasks(uid: string): Promise<Observable<any[]>> {
        this.uid = uid;
        const currentUserNoteRef = doc(collection(this.firestore, 'notes'), uid);
        const currentUserNotes = await getDoc(currentUserNoteRef);

        if (currentUserNotes.exists()) {
            this.collectionRef = collection(currentUserNoteRef, 'tasks');

            const taskDataObservable = collectionData(this.collectionRef, { idField: 'docId' })
            this.subscriptions.push(
                taskDataObservable.subscribe(result => this.sessionTasks = result)
            );
            return taskDataObservable;

        } else {
            this.createNewNoteCollectionForUser();
        }
    }

    async createNewNoteCollectionForUser(): Promise<void> {
        const notesCollection = collection(this.firestore, 'notes');
        await setDoc(doc(notesCollection, this.uid), {});
        this.collectionRef = collection(doc(notesCollection, this.uid), 'tasks');
    }

    removeTask(i:number, docId:string): void {
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
            task: text,
            accomplished: false,
            createdByUserId: this.uid,
            createdTimestamp: new Date(),
        }
        addDoc(this.collectionRef, newTask);
    }

    addEmptyTask(): void {
        this.sessionTasks.push({
            task: ''
        });
    }
}
