import { inject, Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class Snackbar {
  private snackbar = inject(MatSnackBar);
  unsolved(message:string){
    this.snackbar.open(message,'Close',{
      duration:1500,
      panelClass: ['snack-unsolved']
    })
  }
  solved(message:string){
    this.snackbar.open(message,'Close',{
      duration:1500,
      panelClass: ['snack-solved']
    })
  }
}
