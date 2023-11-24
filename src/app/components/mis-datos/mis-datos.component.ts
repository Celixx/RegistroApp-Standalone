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
  public usuario: Usuario;
  passwordRep: string = '';
  mensajeError: string = "";

  constructor(private authGuard: AuthService, private bd: DataBaseService, private router: Router, private toastController: ToastController) {
    this.usuario = new Usuario();
  }

  ionViewWillEnter(): void {
    this.authGuard.leerUsuarioAutenticado().then((usuario: Usuario | undefined) => {
      if (usuario) {
        this.bd.listaUsuarios.subscribe(usuarios => {
          this.listaUsuarios = usuarios;
        });
        this.authGuard.leerUsuarioAutenticado().then((usuario) => {
          if(!usuario){
            return
          }
          this.usuario = usuario;
        })
      } else {
        this.router.navigate(['login'])
      }
    });
  }

  ngOnInit() {
  }

  public guardar(): void {
    this.mensajeError = "";
    this.mensajeError = this.usuario.validarNombre(this.usuario.nombre);
    console.log(this.mensajeError);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
      return
    }
    this.mensajeError = this.usuario.validarApellido(this.usuario.apellido);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
      return
    }
    this.mensajeError = this.usuario.validarCorreo(this.usuario.correo);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
      return
    }
    this.mensajeError = this.usuario.validarPreguntaSecreta(this.usuario.preguntaSecreta);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
      return
    }
    this.mensajeError = this.usuario.validarRespuestaSecreta(this.usuario.respuestaSecreta);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
      return
    }
    this.mensajeError = this.usuario.validarPassword(this.usuario.password);
    if(this.mensajeError != "") {
      this.mostrarMensaje(this.mensajeError);
      return
    }
    if(this.usuario.password != this.passwordRep) {
      this.mostrarMensaje('Error, las contraseñas no coinciden');
      return
    }
    if(this.mensajeError == "") {
      this.bd.updateUsuario(this.usuario, this.usuario.correo);
      this.mostrarMensaje(`Cambios guardados con éxito`, 2000);
    }
  }

  async mostrarMensaje(mensaje: string, duracion?: number) {

    const mensajeToast = await this.toastController.create({
      message: mensaje,
      duration: duracion? duracion: 3000
    });
    mensajeToast.present();
  }

  public cerrarSesion(): void {
    this.authGuard.logout();
  }
}
