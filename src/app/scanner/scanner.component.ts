import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { SettingsService } from '@service/settings.service';
import * as Quagga from 'quagga';
import { Bcds } from '@class/bcds';
import { BcdsService } from '@service/bcds.service';
import { InfoBarService } from '@service/info-bar.service';
import { ShoppingListService } from '@service/shopping-list.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('video', { static: true }) video: ElementRef<HTMLVideoElement>;
  @ViewChild('square', { static: true}) square: ElementRef<HTMLDivElement>;
  @ViewChild('addModal', { static: true }) addModal: ElementRef;

  private worker: Worker;
  private stream: MediaStream;

  private interval: number;
  private intervalMs = 100;

  private barcodeSamples: string[] = [];
  private barcode = '';
  private active = true;
  private requiredScans = 25;

  public err: string;
  public item = new Bcds('', '', '');

  constructor(
    private settings: SettingsService,
    private bcdsService: BcdsService,
    private infobarService: InfoBarService,
    private shoppinglistService: ShoppingListService
    ) {

    if (typeof Worker !== 'undefined' && this.settings.settings.nativeScanner.get()) {

      this.worker = new Worker('./native.worker', { type: 'module' });
      this.worker.addEventListener('message', this.onBarcode);

    }

  }

  ngAfterViewInit() {

    // If native scanner is enabled, use it
    if (this.settings.settings.nativeScanner.get()) {

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

    // Else, use quagga
    } else {
      this.startQuagga();
    }

  }

  ngOnDestroy() {
    this.stop();
    console.log('destroyed');
  }

  private startDetection = (stream: MediaStream) => {

    this.stream = stream;
    this.video.nativeElement.srcObject = stream;
    console.log('Stream active');

    // @ts-ignore
    this.interval = setInterval(() => {

      if (this.active) {

        const height = this.video.nativeElement.clientHeight;
        const width = this.video.nativeElement.clientWidth;

        const vc = document.createElement('canvas');
        vc.height = height;
        vc.width = width;

        const vctx = vc.getContext('2d');
        vctx.drawImage(this.video.nativeElement, 0, 0, width, height);

        const imgd = vctx.getImageData(0, 0, width, height);
        this.worker.postMessage(imgd);

      }

    }, this.intervalMs);

  }

  private onBarcode = ({ data }) => {

    if (data.length && this.active) {

      this.active = false;
      (async () => {
        navigator.vibrate(75);
      })();

      const barcode = data[0];
      console.log(barcode);

      this.bcdsService.get(barcode.rawValue).subscribe(
        res => {
          this.item = res;
          this.toggleAddModal();
        },
        err => {
          this.active = true;
          if (err.status === 404) {
            this.infobarService.show(`Barcode ${this.barcode} not found`, 3000);
          }
        }
      );

    }

  }

  private stop() {

    if (this.settings.settings.nativeScanner.get()) {

      clearInterval(this.interval);
      this.video.nativeElement.pause();
      this.video.nativeElement.srcObject = null;
      this.stream.getTracks().forEach(track => {
        track.stop();
      });

    } else {

      Quagga.stop();

    }
  }

  private startQuagga() {

    Quagga.init(
      {
        numOfWorkers: navigator.hardwareConcurrency,
        locate: true,
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          facingMode: 'environment',
          target: document.querySelector('#scanner') // Or '#yourElement' (optional)
        },
        // photoSettings: {
        //   fillLightMode: 'flash', /* or 'flash' */
        //   focusMode: 'continuous'
        // },
        locator: {
          patchSize: 'medium', // 'medium' | 'large'?
          halfSample: true
        },
        decoder: {
          readers: ['ean_reader', 'ean_8_reader', 'upc_reader'],
          debug: {
            showCanvas: true,
            showPatches: true,
            showFoundPatches: true,
            showSkeleton: true,
            showLabels: true,
            showPatchLabels: true,
            showRemainingPatchLabels: true,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true
            }
          }
        }
      },
      err => {
        if (err) {
          console.log(err);
          this.err = err;
          return;
        }
        // console.log('Initialization finished. Ready to start');
        Quagga.start();
      }
    );

    Quagga.onDetected(data => {

      if (data && this.active) {

        this.barcodeSamples.push(data.codeResult.code);

        if (this.barcodeSamples.length > this.requiredScans) {

          this.active = false;
          this.barcode = this.common(this.barcodeSamples);
          this.barcodeSamples = [];
          navigator.vibrate(75);

          this.bcdsService.get(this.barcode).subscribe(
            res => {
              this.item = res;
              this.toggleAddModal();
            },
            err => {
              this.active = true;
              if (err.status === 404) {
                this.infobarService.show(`Barcode ${this.barcode} not found`, 3000);
              }
            }
          );

        }

        // console.log(data.codeResult.code);
      }

    });

    Quagga.onProcessed(result => {
      const drawingCtx = Quagga.canvas.ctx.overlay;
      const drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute('width'), 10),
            parseInt(drawingCanvas.getAttribute('height'), 10)
          );
          result.boxes
            .filter(function(box) {
              return box !== result.box;
            })
            .forEach(function(box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: 'green',
                lineWidth: 2
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: '#00F',
            lineWidth: 2
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: 'x', y: 'y' },
            drawingCtx,
            { color: 'red', lineWidth: 3 }
          );
        }
      }
    });

  }

  toggleAddModal() {

    this.active = !this.addModal.nativeElement.classList.toggle('show');

  }

  submit(item: Bcds) {

    this.toggleAddModal();

    this.shoppinglistService.add({
      barcode: item.barcode,
      display_name: item.display_name,
      manufacturer: item.manufacturer,
      amount: 1
    }).subscribe(
      _res => {
        this.infobarService.show(`${item.display_name} added to the shopping list`, 3000);
      },
      _err => {
        this.infobarService.show(`And error occurred`, 3000);
      }
    );

    this.active = true;

  }

  private common(arr: Array<string>) {
    return arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();
  }

}
