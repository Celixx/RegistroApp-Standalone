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
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MisDatosComponent  implements OnInit {
  listaUsuarios: Usuario[] = [];
  public usuario: Usuario | undefined;

  constructor(private authGuard: AuthService, private bd: DataBaseService, private router: Router) { }

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

  ngOnInit() {}

  public guardar(): void {}

  public cerrarSesion(): void {}
}
