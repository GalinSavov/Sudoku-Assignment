import { Routes } from '@angular/router';
import { GameBoard } from './components/game-board/game-board';
import { Rules } from './components/rules/rules';
import { About } from './components/about/about';

export const routes: Routes = [
    {path: '', component:GameBoard},
    {path: 'rules',component:Rules},
    {path: 'about',component:About},
    {path: '**',redirectTo:'',pathMatch:'full'}
];
