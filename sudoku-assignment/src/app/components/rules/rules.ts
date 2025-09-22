import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from "@angular/router";
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-rules',
  imports: [RouterLink,MatButton,MatCard,MatCardHeader,MatCardTitle,MatCardContent,MatCardActions,MatIcon],
  templateUrl: './rules.html',
  styleUrl: './rules.scss'
})
export class Rules {

}
