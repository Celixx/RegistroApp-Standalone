import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PreguntaPage implements OnInit {

  public usuario: Usuario;
  public respuesta: string;

  constructor(private activeroute: ActivatedRoute
    , private router: Router, private toastController: ToastController) { 

      this.usuario = new Usuario();
      this.respuesta = ""
      this.activeroute.queryParams.subscribe(params => { 

        const nav = this.router.getCurrentNavigation();
        if (nav) {
          if (nav.extras.state) {
            this.usuario = nav.extras.state['usuario'];
            return;
          }
        }
        this.router.navigate(['/login']); 
      });
      
    }

  ngOnInit() {
  }


  public respuestaRecuperada(): void{
    this.activeroute.queryParams.subscribe(params => { 

      const nav = this.router.getCurrentNavigation();
      if (nav) {
        if (nav.extras.state) {
          this.usuario = nav.extras.state['usuario'];
          return;
        }
      }
      this.router.navigate(['/login']);

    });
  }


  public respuestaPregunta(): void{
    if(this.respuesta === this.usuario.respuestaSecreta){
      
      const navigationExtras: NavigationExtras = {
        state: {
          usuario: this.usuario
        }
      };

      this.router.navigate(['/correcto'],navigationExtras);
    }else{
      
      const navigationExtras: NavigationExtras = {
        state: {
          usuario: this.usuario
        }
      };

      this.router.navigate(['/incorrecto'],navigationExtras);
    }
      
  } 

  
}
