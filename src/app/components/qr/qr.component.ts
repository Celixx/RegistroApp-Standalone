import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AnimationController} from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { NavigationExtras } from '@angular/router';
import { Asistencia } from 'src/app/model/asistencia';
import jsQR, { QRCode } from 'jsqr';
import { HomePage } from 'src/app/pages/home/home.page';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QrComponent  implements OnInit {

  @ViewChild('video')
  private video!: ElementRef;

  @ViewChild('canvas')
  private canvas!: ElementRef;

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  public usuario: Usuario;
  public escaneando = false;
  public asistencia: Asistencia = new Asistencia();
  public datosQR: string = '';

  constructor(private activeroute: ActivatedRoute
    , private router: Router
    , private toastController: ToastController
    , private animationController: AnimationController
    , private homePage: HomePage) { 

    this.usuario = new Usuario();

    this.activeroute.queryParams.subscribe(params => { 

      const nav = this.router.getCurrentNavigation();
      if (nav) {
        if (nav.extras.state) {
          this.usuario = nav.extras.state['usuario'];
          return;
        }
      }
      // this.router.navigate(['/login']);

    });

  }

  ngOnInit() {}

  public miClaseRedirect(): void {
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario,
        asistencia: this.asistencia
      }
    };
    this.router.navigate(['/mi-clase'],navigationExtras);
  }

  public homeRedirect(): void {
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario
      }
    };

    this.router.navigate(['home'],navigationExtras);
  }

  public async scanQR() {

    const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'}
    });
    this.video.nativeElement.srcObject = mediaProvider;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    this.escaneando = true;
    requestAnimationFrame(this.verificarVideo.bind(this));

  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      if (qrCode.data !== '') {
        this.escaneando = false;
        this.mostrarQR(qrCode.data);
        return true;
      }
    }
    return false;
  }

  async mostrarMensaje(mensaje: string, duracion?: number) {

    const mensajeToast = await this.toastController.create({
      message: mensaje,
      duration: duracion? duracion: 3000
    });
    mensajeToast.present();
  }

  public mostrarQR(datosQR: string): void {
    this.datosQR = datosQR;
    const objetoDatosQR = JSON.parse(datosQR);
    this.asistencia.setAsistencia(objetoDatosQR.bloqueInicio, objetoDatosQR.bloqueTermino, objetoDatosQR.dia, objetoDatosQR.horaFin, objetoDatosQR.horaInicio, objetoDatosQR.idAsignatura, objetoDatosQR.nombreAsignatura, objetoDatosQR.nombreProfesor, objetoDatosQR.seccion, objetoDatosQR.sede);
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario,
        asistencia: this.asistencia
      }
    };
    // this.homePage.segmentChanged('mi-clase');
    this.router.navigate(['/home/mi-clase'],navigationExtras)
    this.mostrarMensaje(`Código QR leido exitosamente`, 2000);
  }

  public stopScanQR(): void {
    this.escaneando = false;
  }

  public signOut(): void {
    this.router.navigate(['/login'])
  }

  public animateItem(elementRef: any) {
    this.animationController
      .create()
      .addElement(elementRef)
      .iterations(1)
      .duration(600)
      .fromTo('transform', 'translate(100%)', 'translate(0%)')
      .play();
  }

  public ngAfterViewInit(): void {
    if (this.itemTitulo) {
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(6000)
        .fromTo('transform', 'scale(0)', 'scale(1)');

      animation.play();
    }
  }



}