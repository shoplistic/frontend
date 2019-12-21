/// <reference lib="webworker" />

// @ts-ignore
const bc = new BarcodeDetector();

addEventListener('message', ({ data }) => {

  bc.detect(data).then((barcodes) => {

    postMessage(barcodes);

  }).catch(e => {
    console.error('Error detecting barcode', e);
  })

});
