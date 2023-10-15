import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { Asistencia } from '../../model/asistencia';
import { ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-guard.service';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-mi-clase',
  templateUrl: './mi-clase.component.html',
  styleUrls: ['./mi-clase.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MiClaseComponent implements OnInit {

  public asistencia: Asistencia = new Asistencia();
  listaUsuarios: Usuario[] = [];
  public usuario: Usuario | undefined;

  constructor(private activeroute: ActivatedRoute
    , private router: Router
    , private toastController: ToastController
    , private animationController: AnimationController
    , private authGuard: AuthService
    , private bd : DataBaseService) {
    this.usuario = new Usuario();

    this.activeroute.queryParams.subscribe(params => {

      const nav = this.router.getCurrentNavigation();
      if (nav) {
        if (nav.extras.state) {
          this.usuario = nav.extras.state['usuario'];
          this.asistencia = nav.extras.state['asistencia']
          return;
        }
      }
      // this.router.navigate(['/login']);

    });
  }

  ionViewWillEnter(): void {
    const userAuth = this.authGuard.leerUsuarioAutenticado();
    console.log(userAuth);

    this.authGuard.leerUsuarioAutenticado().then((usuario: Usuario | undefined) => {
      if (usuario) {
        this.bd.listaUsuarios.subscribe(usuarios => {
          this.listaUsuarios = usuarios;
        });
        this.authGuard.leerUsuarioAutenticado().then((usuario) => {
          this.usuario = usuario;
        })
      } else {
        this.router.navigate(['login'])
      }
    });
  }

  ngOnInit() { }

  public homeRedirect(): void {
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario,
        asistencia: this.asistencia
      }
    };

    this.router.navigate(['/home'],navigationExtras)
  }

  public miClaseRedirect(): void {
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario,
        asistencia: this.asistencia
      }
    };

    this.router.navigate(['/mi-clase'],navigationExtras)
  }

  public signOut(): void {
    this.router.navigate(['/login'])
  }

}
