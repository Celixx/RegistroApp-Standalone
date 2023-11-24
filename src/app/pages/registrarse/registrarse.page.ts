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
    console.log(this.usuario);
    this.mensajeError = this.usuario.validarNombre(this.usuario.nombre);
    console.log(this.mensajeError);
    this.mensajeError = this.usuario.validarApellido(this.usuario.apellido);
    this.mensajeError = this.usuario.validarCorreo(this.usuario.correo);
    this.mensajeError = this.usuario.validarPreguntaSecreta(this.usuario.preguntaSecreta);
    this.mensajeError = this.usuario.validarRespuestaSecreta(this.usuario.respuestaSecreta);
    this.mensajeError = this.usuario.validarPassword(this.usuario.password);
    if(this.usuario.nombre !== "") {
      this.mostrarMensaje('error');
      console.log('error');
    }
  }
}
