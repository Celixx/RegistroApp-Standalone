import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';

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

  constructor(private router: Router, private toastController: ToastController) {
    this.correo = "";
    this.usuario = new Usuario('', '', '', '', '', '', 0, null);
   }

  ngOnInit() {
  }
  
  
  public Recuperar (): void{
    
    
    const usuarioRecuperado: Usuario | undefined = this.usuario.buscarUsuarioCorreo(this.correo);

    if (usuarioRecuperado?.correo === this.correo){
      
      const navigationExtras: NavigationExtras = {
        state: {
          usuario: usuarioRecuperado 
        }
        
      };
      
      this.router.navigate(['/pregunta'],navigationExtras);
    } else {
      this.router.navigate(['/incorrecto']);
    }

    
  }
  
  async mostrarMensaje(mensaje: string, duracion?: number) {

    const mensajeToast = await this.toastController.create({
      message: mensaje,
      duration: duracion? duracion: 3000
    });
    mensajeToast.present();
  }
  
  
  

}
