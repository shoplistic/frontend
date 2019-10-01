import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.scss']
})
export class DevComponent implements OnInit, OnDestroy {

  @ViewChild('video', { static: true }) video: ElementRef<HTMLVideoElement>;
  @ViewChild('square', { static: true}) square: ElementRef<HTMLDivElement>;

  private worker: Worker;
  private stream: MediaStream;

  private interval: number;
  private intervalMs = 100;

  constructor() {

    if (typeof Worker !== 'undefined') {

      this.worker = new Worker('./dev.worker', { type: 'module' });
      this.worker.addEventListener('message', this.onBarcode);

    }

  }

  ngOnInit() {

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          ideal: 'environment'
        }
      },
      audio: false,
    })
    .then(this.startDetection)
    .catch(e => {
      console.error(e);
    });

  }

  private startDetection = (stream: MediaStream) => {

    this.stream = stream;
    this.video.nativeElement.srcObject = stream;
    console.log('Stream active');

    // @ts-ignore
    this.interval = setInterval(() => {

      const height = this.video.nativeElement.clientHeight;
      const width = this.video.nativeElement.clientWidth;

      const vc = document.createElement('canvas');
      vc.height = height;
      vc.width = width;

      const vctx = vc.getContext('2d');
      vctx.drawImage(this.video.nativeElement, 0, 0, width, height);

      const imgd = vctx.getImageData(0, 0, width, height);
      this.worker.postMessage(imgd)

    }, this.intervalMs);

  }

  private onBarcode = ({ data }) => {

    if (data.length) {

      const barcode = data[0];
      console.log(barcode);

    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.video.nativeElement.pause();
    this.video.nativeElement.srcObject = null;
    this.stream.getTracks().forEach(track => {
      track.stop();
    });
    console.log('destroyed');
  }

}
