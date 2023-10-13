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
import { StorageService } from 'src/app/services/storage.service';

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
  public usuarioRescatado: Usuario;
  rescatado: Array<Usuario>=[];

  constructor(private router: Router, private toastController: ToastController, private bd: DataBaseService, private storage: StorageService) {
    this.bd.listaUsuarios.subscribe(usuarios => {
      this.listaUsuarios = usuarios;
    })
    this.usuario = new Usuario();
    this.usuarioRescatado = new Usuario();
  }

  public ngOnInit(): void {
    console.log(this.usuario)
  }

  async ingresar() {
    // Assuming this.usuario is an instance of a user object
    const validar: boolean = await this.usuario.validarUsuario(this.bd, this.usuario.correo, this.usuario.password);    
    
    if(validar) {
      console.log('validado');
      
      this.rescatado.concat(await this.bd.leerUsuario(this.usuario.correo));
      console.log(this.rescatado);
      await this.storage.guardarUsuarioAutenticadoConPrivacidad(this.rescatado[0]);

      // Mensaje toast
      this.mostrarMensaje(`Inicio de sesión exitoso, Bienvenido(a) ${this.usuario.nombre} ${this.usuario.apellido}`);
      // Redirect
      //this.router.navigate(['/home/qr']);
    } else {
      console.log('incorrecto');
      // Show an error message to the user
      this.mostrarMensaje('Credenciales incorrectas');
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