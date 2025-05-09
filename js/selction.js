import { searchCode } from "./jsCode.js";
/* ::::::::::::::::: */
const resultDiv = document.getElementById("result");
const loader = document.getElementById("loader");
const instructions = document.getElementById("instructions");
const selectionBox = document.getElementById("selectionBox");



const uploadedImage = document.getElementById('uploadedImage');
function fnctn2() {
  resetSelection();
      analyzeImage();
}


function showMessage(message, type) {
  resultDiv.style.display = "block";
  resultDiv.className = type;
  resultDiv.innerHTML = message;
}

function resetSelection() {
  selectionBox.style.display = "none";
  instructions.style.display = "none";
  resultDiv.style.display = "none";
}

// الكشف التلقائي
function analyzeImage() {
  loader.style.display = "block";

  Quagga.decodeSingle(
    {
      decoder: {
        readers: ["code_128_reader", "ean_reader", "upc_reader"],
      },
      locate: true,
      src: uploadedImage.src,
    },
     function (result) {
      loader.style.display = "none";
      
      if (result && result.codeResult) {
        let codeCountry = result.codeResult.code.slice(0, 3) * 1;
        showMessage( `Barcode value is : <span id="barCode">${result.codeResult.code}</span><br><br> 
        ${searchCode(codeCountry)}`, 'success')
       
      } else {
        showMessage("No barcode found, please select manually", "error");
        enableManualSelection();
      }
    }
  );
}




/* sellect image */
const imageContainer = document.getElementById("img-view");
let isSelecting = false;
        let startX, startY, endX, endY;
        let scaleX = 1, scaleY = 1;

// التحديد اليدوي
function enableManualSelection() {
  instructions.style.display = "block";

  // أحداث اللمس
  imageContainer.addEventListener("touchstart", startSelection);
  document.addEventListener("touchmove", drawSelection);
  document.addEventListener("touchend", endSelection);

  // أحداث الماوس
  imageContainer.addEventListener("mousedown", startSelection);
  document.addEventListener("mousemove", drawSelection);
  document.addEventListener("mouseup", endSelection);
}

function startSelection(e) {
  e.preventDefault();
  isSelecting = true;

  const rect = imageContainer.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  startX = clientX - rect.left;
  startY = clientY - rect.top;

  selectionBox.style.display = "block";
  updateSelectionBox();
}

function drawSelection(e) {
  if (!isSelecting) return;
  e.preventDefault();

  const rect = imageContainer.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  endX = clientX - rect.left;
  endY = clientY - rect.top;

  updateSelectionBox();
}

function endSelection() {
  isSelecting = false;
  analyzeSelectedArea();
}

function updateSelectionBox() {
  const width = endX - startX;
  const height = endY - startY;

  selectionBox.style.left = Math.min(startX, endX) + "px";
  selectionBox.style.top = Math.min(startY, endY) + "px";
  selectionBox.style.width = Math.abs(width) + "px";
  selectionBox.style.height = Math.abs(height) + "px";
}

 function analyzeSelectedArea() {
  loader.style.display = "block";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = uploadedImage.naturalWidth;
  canvas.height = uploadedImage.naturalHeight;

  // حساب الإحداثيات مع هامش 10%
  const margin = 0.1;
  const realX = Math.min(startX, endX) * scaleX * (1 - margin);
  const realY = Math.min(startY, endY) * scaleY * (1 - margin);
  const realWidth = Math.abs(endX - startX) * scaleX * (1 + margin);
  const realHeight = Math.abs(endY - startY) * scaleY * (1 + margin);

  ctx.drawImage(
    uploadedImage,
    realX,
    realY,
    realWidth,
    realHeight,
    0,
    0,
    realWidth,
    realHeight
  );
  // تحليل المنطقة المحددة
  Quagga.decodeSingle(
    {
      decoder: {
        readers: ["code_128_reader", "ean_reader", "upc_reader"],
      },
      locate: true,
      src: canvas.toDataURL(),
    },
    function (result) {
      loader.style.display = "none";
      if (result && result.codeResult) {
        let codeCountry = result.codeResult.code.slice(0, 3) * 1;
        showMessage( `Barcode value is : <span id="barCode">${result.codeResult.code}</span><br><br> 
        ${searchCode(codeCountry)}`, 'success')
      
      } else {
        showMessage("No barcode found, please select manually", "error");
      }
    }
  );
}

export { fnctn2, showMessage, resetSelection, analyzeImage, enableManualSelection };
