import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { HuespedesComponent } from './components/huespedes/huespedes.component';

const routes: Routes = [
  {path:'', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent, /*canActivate: [AuthGuard]*/
    children: [
      {path: 'habitaciones', component: HabitacionesComponent, pathMatch: 'full'},
      {path: 'reservaciones', component: ReservasComponent, pathMatch: 'full'},
      {path: 'huespedes', component: HuespedesComponent, pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
