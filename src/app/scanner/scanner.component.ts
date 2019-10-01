import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as Quagga from 'quagga';
import { Bcds } from '@class/bcds';
import { BcdsService } from '@service/bcds.service';
import { ShoppingListService } from '@service/shopping-list.service';
import { InfoBarService } from '@service/info-bar.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('addModal', { static: true }) addModal: ElementRef;

  barcodeSamples: string[] = [];
  barcode = '';
  item = new Bcds('', '', '');
  active = true;
  requiredScans = 25;
  err: string;

  constructor(
    private _bcdsService: BcdsService,
    private _infobarService: InfoBarService,
    private _shoppinglistService: ShoppingListService
  ) {}

  ngAfterViewInit() {
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
          this.barcode = common(this.barcodeSamples);
          this.barcodeSamples = [];
          navigator.vibrate(75);

          this._bcdsService.get(this.barcode).subscribe(
            res => {
              this.item = res;
              this.toggleAddModal();
            },
            err => {
              this.active = true;
              if (err.status === 404) {
                this._infobarService.show(`Barcode ${this.barcode} not found`, 3000);
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

  ngOnDestroy() {
    Quagga.stop();
  }

  toggleAddModal() {

    this.active = !this.addModal.nativeElement.classList.toggle('show');

  }

  submit(item: Bcds) {

    this.toggleAddModal();

    this._shoppinglistService.add({
      barcode: item.barcode,
      display_name: item.display_name,
      manufacturer: item.manufacturer,
      amount: 1
    }).subscribe(
      _res => {
        this._infobarService.show(`${item.display_name} added to the shopping list`, 3000);
      },
      _err => {
        this._infobarService.show(`And error occurred`, 3000);
      }
    );

  }

}

function common(arr: Array<string>) {
  return arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();
}
