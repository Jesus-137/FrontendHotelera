import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HuespedesComponent } from './components/huespedes/huespedes.component';

const routes: Routes = [
   {path: 'huespedes', component: HuespedesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
