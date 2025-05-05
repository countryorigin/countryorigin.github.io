import { BrowserMultiFormatReader } from "https://cdn.jsdelivr.net/npm/@zxing/browser@0.0.10/+esm";
import { cuntrys, gebi } from "./cntris.js";

const codeReader = new BrowserMultiFormatReader();

const dropArea = gebi("drop-area");
const imgView = gebi("img-view");

const inputFile = gebi("input-file");
inputFile.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) {
    gebi("errImg").style.display = "block";
  }

  const imageUrl = URL.createObjectURL(file);

  imgView.style.backgroundImage = `url(${imageUrl})`;
  imgView.textContent = "";
  imgView.style.border = 0;

  const img = new Image();
  img.src = imageUrl;
  img.onload = async () => {
    gebi("cntnr").style.display = "block";
      gebi("exist").style.display = "block";
      gebi("divplac").className += " opPlc";

    try {
      const r = await codeReader.decodeFromImageElement(img);
      let result = r.text;
      /* console.log("Barcode value:", cuntrys[5]);
      alert(`Barcode value : ${result}`); */
      let codeCountry = result.slice(0, 3) * 1;
      

      for (let i = 0; i < cuntrys.length; i++) {
        let prefix = cuntrys[i].prefix;
        let prefix2 = cuntrys[i].prefix2;
        if (prefix < codeCountry && prefix2 > codeCountry) {
          let barcode_name = cuntrys[i].barcode_name;
          gebi("exist").innerHTML = `Barcode value is : <span id="barCode">${result}</span> 
            <br><br>  Country of origin is : <span> ${barcode_name}</span>`;
          return 0;
        }
        
      }
      gebi("exist").innerHTML = `Barcode value is : <span id="barCode">${result}</span> 
      <br><br>  Country of origin is Not found in the database`;
    } catch (err) {
      gebi("exist").innerHTML = `No barcode found in the image.`;
    }
  };
});
