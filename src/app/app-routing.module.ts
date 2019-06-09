import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from 'src/guard/auth.guard';
import { GuestGuard } from 'src/guard/guest.guard';

const routes: Routes = [
  { path: '', canActivateChild: [AuthGuard], loadChildren: './layout/layout.module#LayoutPageModule' },
  { path: 'login', canActivateChild: [GuestGuard], component: LoginComponent},
  { path: 'register', canActivateChild: [GuestGuard], component: RegisterComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
