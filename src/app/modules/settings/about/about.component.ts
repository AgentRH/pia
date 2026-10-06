import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { instance } from 'src/environments/instance';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: false
})
export class AboutComponent implements OnInit {
  appVersion: string;
  // AgentRH : dépôt public du code source de cette version (mention GPLv3)
  sourceUrl: string = instance.sourceUrl;

  constructor() {}

  ngOnInit() {
    this.appVersion = environment.version;
  }
}
