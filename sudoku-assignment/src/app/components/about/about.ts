import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-about',
  imports: [MatCard, MatCardTitle, MatCardContent, MatCardSubtitle, MatCardHeader, MatCardActions,MatButton, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {

}
