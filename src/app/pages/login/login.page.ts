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
import { AuthService } from 'src/app/services/auth-guard.service';

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
  public inputCorreo: string = "";
  public inputPassword: string = "";
  rescatado: Array<Usuario>=[];

  constructor(private router: Router, private toastController: ToastController, private bd: DataBaseService, private storage: StorageService, private authGuard: AuthService) {
    this.bd.listaUsuarios.subscribe(usuarios => {
      this.listaUsuarios = usuarios;
    })
    this.usuario = new Usuario();
    this.usuarioRescatado = new Usuario();
  }

  public ngOnInit(): void {
  }

  async ingresar() {
    this.authGuard.login(this.inputCorreo, this.inputPassword)
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

  public registrar() {
    this.router.navigate(['/registrarse'])
  }

}