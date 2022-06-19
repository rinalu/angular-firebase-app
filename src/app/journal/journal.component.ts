import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-regular-svg-icons'

import { stateChangeAnimation } from '../animations';

@Component({
    selector: 'journal',
    templateUrl: './journal.component.html',
    styleUrls: ['../../assets/scss/journal.scss'],
    animations: stateChangeAnimation
})

export class JournalComponent {
    
}
