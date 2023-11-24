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
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegistrarsePage implements OnInit {

  listaUsuarios: Usuario[] = [];
  public usuario: Usuario;
  passwordRep: string = '';
  public mensajeError: string = "";

  constructor(private authGuard: AuthService, private bd: DataBaseService, private router: Router, private toastController: ToastController) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
  }

  async mostrarMensaje(mensaje: string, duracion?: number) {

    const mensajeToast = await this.toastController.create({
      message: mensaje,
      duration: duracion? duracion: 3000
    });
    mensajeToast.present();
  }

  public registrar() {
    // Validaciones
    this.mensajeError = this.usuario.validarNombre(this.usuario.nombre);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
    }
    this.mensajeError = this.usuario.validarApellido(this.usuario.apellido);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
    }
    this.mensajeError = this.usuario.validarCorreo(this.usuario.correo);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
    }
    this.mensajeError = this.usuario.validarPreguntaSecreta(this.usuario.preguntaSecreta);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
    }
    this.mensajeError = this.usuario.validarRespuestaSecreta(this.usuario.respuestaSecreta);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
    }
    this.mensajeError = this.usuario.validarPassword(this.usuario.password);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
    }
    if(this.usuario.password != this.passwordRep) {
      this.mostrarMensaje('Error, las contraseñas no coinciden');
    }

    // Creación del usuario
    this.bd.guardarUsuario(this.usuario);
    this.mostrarMensaje('Usuario creado con éxito');

    //Navigate login
    this.router.navigate([''])
  }

  public volverInicio() {
    this.router.navigate([''])
  }
}
