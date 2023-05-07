import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { JournalRoutingModule } from './journal-routing.module';
import { JournalComponent } from './journal.component';
import { JournalAuthComponent } from './journal-auth/journal-auth.component';
import { JournalEditComponent } from './journal-edit/journal-edit.component';
import { getAuth, provideAuth } from '@angular/fire/auth';

@NgModule({
    declarations: [
        JournalComponent,
        JournalAuthComponent,
        JournalEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        JournalRoutingModule,
        provideAuth(() => getAuth()),
    ]
})
export class JournalModule {}
