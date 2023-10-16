import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiclientService } from 'src/app/services/apiclient.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-guard.service';
import { DataBaseService } from 'src/app/services/data-base.service';
import { Usuario } from '../../model/usuario'
import { Router } from '@angular/router';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ForoComponent  implements OnInit {

  selectedUserId: any;
  usuarios: any;
  publicacion: any = {
    userId: null,
    id: null,
    title: '',
    body: '',
    name: ''
  };
  publicaciones: Array<any> = [];
  publicacionSeleccionada: any;

  listaUsuarios: Usuario[] = [];
  public usuario: Usuario | undefined;

  constructor(
    private api: ApiclientService,
    private toastController: ToastController,
    private authGuard: AuthService,
    private bd: DataBaseService,
    private router: Router) { }
    
  ngOnInit() {}

  ionViewWillEnter() {
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

    this.selectedUserId = null;
    this.setPublicacion(null, null, '', '', '');
    this.getUsuarios();
    this.getPublicaciones();
  }

  cambiarUsuario($event: number) {
    this.setPublicacion($event, null, '', '', '');
  }

  limpiarPublicacion() {
    this.setPublicacion(this.selectedUserId, null, '', '', '');
  }


  setPublicacion(userId: any, pubId: any, title: any, body: any, name: any) {

    this.publicacion.userId = userId;
    this.publicacion.id = pubId;
    this.publicacion.title = title;
    this.publicacion.body = body;
    this.publicacion.name = name;

    const uid = userId === null? 'no seleccionado' : userId;
    const pid = pubId === null? 'nueva' : pubId;
    this.publicacionSeleccionada = `(userId: ${uid} - pubId: ${pid})`;
  }

  getUsuarios() {
    this.api.getUsuarios().subscribe(data => this.usuarios = data);
  }

  getPublicaciones() {

    this.api.getPosts().subscribe((publicaciones) => {
      this.api.getUsuarios().subscribe((usuarios) => {
        publicaciones.forEach((publicacion: any) => {
          publicacion.name = usuarios.find((u: any) => u.id === publicacion.userId).name;
        });
        publicaciones.reverse();
        this.publicaciones = publicaciones;
      });
    });
  }

  guardarPublicacion() {
    if (this.publicacion.userId === null) {
      this.mostrarMensaje('Antes de hacer una publicación debe seleccionar un usuario.');
      return;
    }
    if (this.publicacion.title.trim() === '') {
      this.mostrarMensaje('Antes de hacer una publicación debe llenar el título.');
      return;
    }
    if (this.publicacion.body.trim() === '') {
      this.mostrarMensaje('Antes de hacer una publicación debe llenar el cuerpo.');
      return;
    }
    if (this.publicacion.id === null) {
      this.crearPublicacion();
    }
    else {
      this.actualizarPublicacion();
    }
  }

  crearPublicacion() {
    this.api.createPost(this.publicacion).subscribe(
      (data) => {
        this.mostrarMensaje(`PUBLICACION CREADA CORRECTAMENTE: ${data.id} ${data.title}...`);
        this.limpiarPublicacion();
        this.getPublicaciones();
      },
      (error) => this.mostrarError('NO FUE POSIBLE CREAR LA PUBLICACION.', error)
    );
  }

  actualizarPublicacion() {
    this.api.updatePost(this.publicacion).subscribe(
      (data) => {
        this.mostrarMensaje(`PUBLICACION ACTUALIZADA CORRECTAMENTE: ${data.id} ${data.title}...`);
        this.limpiarPublicacion();
        this.getPublicaciones();
      },
      (error) => this.mostrarError('NO FUE POSIBLE ACTUALIZAR LA PUBLICACION.', error)
    );
  }

  editarPublicacion($event){
    const pub = $event;
    this.setPublicacion(pub.userId, pub.id, pub.title, pub.body, pub.name);
    document.getElementById('topOfPage')?.scrollIntoView({block: 'end', behavior: 'smooth'});
  }

  eliminarPublicacion($event){
    const pubId = $event.id;
    this.api.deletePost(pubId).subscribe(
      (data) => {
        this.mostrarMensaje(`PUBLICACION ELIMINADA CORRECTAMENTE: ${pubId}...`);
        this.limpiarPublicacion();
        this.getPublicaciones();
      },
      (error) => this.mostrarError('NO FUE POSIBLE ELIMINAR LA PUBLICACION.', error)
    );
  }

  getIdentificadorItemPublicacion(index: any, item: any) {
    return item.id;
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }

  async mostrarError(mensaje: any, error: any) {
    console.log(mensaje);
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
    throw error;
  }

  public limpiar(): void {}

  public publicar(): void {}
}

