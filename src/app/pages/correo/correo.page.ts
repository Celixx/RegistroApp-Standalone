import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CorreoPage implements OnInit {
  
  public correo: string;
  public usuario: Usuario;
  listaUsuarios: Usuario[] = [];

  constructor(private router: Router, private toastController: ToastController, private bd: DataBaseService) {
    this.bd.listaUsuarios.subscribe(usuarios => {
      this.listaUsuarios = usuarios;
    })
    this.correo = "";
    this.usuario = new Usuario();
   }

  ngOnInit() {
  }
  
  
  async Recuperar () {

    if(this.usuario.correo === ""){
      this.router.navigate(['/incorrecto'])
    }
    else{
      const usu = await this.bd.leerUsuario(this.usuario.correo);
      if(usu){
        const navigationExtras: NavigationExtras = {
          state: {
            usuario: usu 
          }
         
       };
        this.router.navigate(['/pregunta'], navigationExtras)
      }else{
        this.router.navigate(['/incorrecto'])
      }
    }
    // const usuarioRecuperado: Usuario | undefined = this.usuario.buscarUsuarioCorreo(this.correo);

    // if (usuarioRecuperado?.correo === this.correo){
      
    //   const navigationExtras: NavigationExtras = {
    //     state: {
    //       usuario: usuarioRecuperado 
    //     }
        
    //   };
      
    //   this.router.navigate(['/pregunta'],navigationExtras);
    // } else {
    //   this.router.navigate(['/incorrecto']);
    // }

    
  }
  
  async mostrarMensaje(mensaje: string, duracion?: number) {

    const mensajeToast = await this.toastController.create({
      message: mensaje,
      duration: duracion? duracion: 3000
    });
    mensajeToast.present();
  }

  public volverIniciar() {
    this.router.navigate(['/login'])
  }
}
