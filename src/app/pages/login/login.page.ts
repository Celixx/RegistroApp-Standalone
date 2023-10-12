import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  public usuario: Usuario;

  constructor(private router: Router, private toastController: ToastController) {
    this.usuario = new Usuario('', '', '', '', '', '', 0, null)
  }

  public ngOnInit(): void {
  }

  public ingresar(): void {
    // Validación del usuario
    if (this.usuario) {
      const mensajeError = this.usuario.validarUsuario();
      if (mensajeError) {
        this.mostrarMensaje(mensajeError);
      }
      // Búsqueda del usuario validado
      const usuarioLog: Usuario | undefined = this.usuario.buscarUsuarioValido(this.usuario.correo, this.usuario.password);

      if(usuarioLog){
        const navigationExtras: NavigationExtras = {
          state: {
            usuario: usuarioLog
          }
        };
        // Mensaje toast
        this.mostrarMensaje(`Inicio de sesión exitoso, Bienvenido(a) ${usuarioLog.nombre} ${usuarioLog.apellido}`);
        // Redirect
        this.router.navigate(['/home/qr'],navigationExtras)
      }
    }
  }

  public recuperar(): void {
    this.router.navigate(['/correo'])
  }

  async mostrarMensaje(mensaje: string, duracion?: number) {

    const mensajeToast = await this.toastController.create({
      message: mensaje,
      duration: duracion? duracion: 3000
    });
    mensajeToast.present();
  }

}