import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage),
    children: [
      {
        path: 'qr',
        loadComponent: () => import('./components/qr/qr.component').then( m => m.QrComponent)
      },
      {
        path: 'mi-clase',
        loadComponent: () => import('./components/mi-clase/mi-clase.component').then( m => m.MiClaseComponent)
      },
      {
        path: 'mis-datos',
        loadComponent: () => import('./components/mis-datos/mis-datos.component').then( m => m.MisDatosComponent)
      },
      {
        path: 'foro',
        loadComponent: () => import('./components/foro/foro.component').then( m => m.ForoComponent)
      },
      {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent)
      }
    ]
  },
  {
    path: 'correcto',
    loadComponent: () => import('./pages/correcto/correcto.page').then( m => m.CorrectoPage)
  },
  {
    path: 'incorrecto',
    loadComponent: () => import('./pages/incorrecto/incorrecto.page').then( m => m.IncorrectoPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'pregunta',
    loadComponent: () => import('./pages/pregunta/pregunta.page').then( m => m.PreguntaPage)
  },
  {
    path: 'correo',
    loadComponent: () => import('./pages/correo/correo.page').then( m => m.CorreoPage)
  },
  {
    path: 'registrarse',
    loadComponent: () => import('./pages/registrarse/registrarse.page').then( m => m.RegistrarsePage)
  },
];
