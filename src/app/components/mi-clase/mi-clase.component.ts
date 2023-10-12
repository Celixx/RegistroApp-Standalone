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

@Component({
  selector: 'app-mi-clase',
  templateUrl: './mi-clase.component.html',
  styleUrls: ['./mi-clase.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MiClaseComponent implements OnInit {

  public usuario: Usuario;
  public asistencia: Asistencia = new Asistencia();

  constructor(private activeroute: ActivatedRoute
    , private router: Router
    , private toastController: ToastController
    , private animationController: AnimationController) {
    this.usuario = new Usuario('', '', '', '', '', '', 0, null);

    this.activeroute.queryParams.subscribe(params => {

      const nav = this.router.getCurrentNavigation();
      if (nav) {
        if (nav.extras.state) {
          this.usuario = nav.extras.state['usuario'];
          this.asistencia = nav.extras.state['asistencia']
          return;
        }
      }
      // this.router.navigate(['/login']);

    });
  }

  ngOnInit() { }

  public homeRedirect(): void {
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario,
        asistencia: this.asistencia
      }
    };

    this.router.navigate(['/home'],navigationExtras)
  }

  public miClaseRedirect(): void {
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario,
        asistencia: this.asistencia
      }
    };

    this.router.navigate(['/mi-clase'],navigationExtras)
  }

  public signOut(): void {
    this.router.navigate(['/login'])
  }

}
