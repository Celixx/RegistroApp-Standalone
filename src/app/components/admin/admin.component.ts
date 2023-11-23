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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminComponent  implements OnInit {

  listaUsuarios: Usuario[] = [];
  passwordRep: string = '';

  constructor(private authGuard: AuthService, private bd: DataBaseService, private router: Router, private toastController: ToastController) {
    this.bd.listaUsuarios.subscribe(usuarios => {
      this.listaUsuarios = usuarios;
    })
  }

  ngOnInit() {
    console.log(this.listaUsuarios);
  }

  public eliminarUsuario($event) {
    const usuario = $event.correo;
    this.bd.eliminarUsuarioUsandoCorreo(usuario);
    this.mostrarMensaje('Usuario eliminado con éxito');
    
  }

  async mostrarMensaje(mensaje: string, duracion?: number) {

    const mensajeToast = await this.toastController.create({
      message: mensaje,
      duration: duracion? duracion: 3000
    });
    mensajeToast.present();
  }
}
