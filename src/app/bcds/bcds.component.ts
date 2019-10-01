import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as Quagga from 'quagga';
import { Bcds } from '@class/bcds';
import { BcdsService } from '@service/bcds.service';
import { InfoBarService } from '@service/info-bar.service';

@Component({
  selector: 'app-bcds',
  templateUrl: './bcds.component.html',
  styleUrls: ['./bcds.component.scss']
})
export class BcdsComponent implements AfterViewInit, OnDestroy {

  @ViewChild('addModal', { static: true }) addModal: ElementRef;
  @ViewChild('af', { static: true }) af: ElementRef;

  barcodeSamples: string[] = [];
  barcode = '';
  item = new Bcds('', '', '');
  isNew = false;
  active = true;
  requiredScans = 25;
  err: string;

  constructor(
    private _bcdsService: BcdsService,
    private _infobarService: InfoBarService
  ) { }

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
        console.log('Initialization finished. Ready to start');
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
              console.log('found an item');
              this.isNew = false;
              this.item = res;
              this.toggleModal();
            },
            err => {
              this.active = true;
              if (err.status === 404) {
                // Item does not exist, add it?
                this.isNew = true;
                this.item = new Bcds(this.barcode, '', '');
                this.toggleModal();
                this.af.nativeElement.focus();
              } else {
                this._infobarService.show('An error occurred', 3000);
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

  toggleModal() {

    this.active = !this.addModal.nativeElement.classList.toggle('show');

  }

  onSubmit(item: Bcds) {

    console.log(item);
    console.log('submitted');

    if (this.isNew) {

      this._bcdsService.add(item).subscribe(
        _res => {
          this.toggleModal();
          this._infobarService.show(`${item.display_name} added to the bcds`, 3000);
        },
        _err => {
          this._infobarService.show(`Error adding ${item.display_name} to the bcds`, 3000);
        }
      );

    } else {

      this._bcdsService.edit(item).subscribe(
        _res => {
          this.toggleModal();
          this._infobarService.show(`${item.display_name} saved`, 3000);
        },
        _err => {
          this._infobarService.show(`Error saving ${item.display_name}`, 3000);
        }
      );

    }

  }

  submiteDelete(item: Bcds) {

    this._bcdsService.delete(item.barcode).subscribe(
      _res => {
        this.toggleModal();
        this._infobarService.show(`${item.display_name} deleted`, 3000);
      },
      _err => {
        this._infobarService.show(`Error removing ${item.display_name}`, 3000);
      }
    );

  }

}

function common(arr: Array<string>) {
  return arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();
}

