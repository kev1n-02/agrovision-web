// =====================================================================
// Rutas del front.
//   /login         → pantalla de inicio de sesión (pública)
//   /inicio, ...   → dentro de la estructura con menú (requieren sesión)
// Cada pantalla nueva se agrega dentro de "children".
// =====================================================================
import { Routes } from '@angular/router';
import { sesionGuard } from './core/guards/auth.guard';
import { Estructura } from './estructura/estructura';
import { Login } from './paginas/login/login';
import { Inicio } from './paginas/inicio/inicio';

export const routes: Routes = [
  { path: 'login', component: Login, title: 'Iniciar sesión | AgroVision' },
  {
    path: '',
    component: Estructura,
    canActivate: [sesionGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', component: Inicio, title: 'Inicio | AgroVision' },
    ],
  },
  { path: '**', redirectTo: '' },
];
