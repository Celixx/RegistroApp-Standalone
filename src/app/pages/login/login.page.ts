import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { Router, NavigationExtras } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { showAlertDUOC, showAlertYesNoDUOC } from '../../model/message';
import { MessageEnum } from '../../model/message-enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class LoginPage implements OnInit {
  listaUsuarios: Usuario[] = [];
  public usuario: Usuario;

  constructor(private router: Router, private toastController: ToastController, private bd: DataBaseService) {
    this.bd.listaUsuarios.subscribe(usuarios => {
      this.listaUsuarios = usuarios;
    })
    this.usuario = new Usuario();
  }

  public ngOnInit(): void {
    console.log(this.usuario)
  }

  async ingresar() {
    // Validación del usuario
    // if (this.usuario) {
    //   const mensajeError = this.usuario.validarUsuario();
    //   if (mensajeError) {
    //     this.mostrarMensaje(mensajeError);
    //   }
      // Búsqueda del usuario validado
      console.log(this.usuario)
      const validar: boolean = await this.usuario.validarUsuario(this.bd, this.usuario.correo, this.usuario.password);    
      if(validar) {
        console.log('validado');
      }else{
        
        console.log('incorrecto');
      }
      // const usuarioLog: Usuario | undefined = this.usuario.buscarUsuarioValido(this.usuario.correo, this.usuario.password);

      // if(usuarioLog){
      //   const navigationExtras: NavigationExtras = {
      //     state: {
      //       usuario: usuarioLog
      //     }
      //   };
      //   // Mensaje toast
      //   this.mostrarMensaje(`Inicio de sesión exitoso, Bienvenido(a) ${usuarioLog.nombre} ${usuarioLog.apellido}`);
      //   // Redirect
      //   this.router.navigate(['/home/qr'],navigationExtras);
      // }
    
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