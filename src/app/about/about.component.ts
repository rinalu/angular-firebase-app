import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { AboutService } from './about.service';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['../../assets/scss/about.scss']
})

export class AboutComponent {
    faCaretRight = faCaretRight;

    constructor(public aboutService: AboutService, private db: Firestore) {
        aboutService.getSkills();
        aboutService.getExperiences();
    }

    ngOnDestroy() {
        this.aboutService.subscriptions.map(e => e.unsubscribe());
    }
}
