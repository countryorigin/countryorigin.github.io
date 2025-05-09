import { BrowserMultiFormatReader } from "https://cdn.jsdelivr.net/npm/@zxing/browser@0.0.10/+esm";
import{fnctn2, showMessage} from "./selction.js"
import { cuntrys, gebi, slctAll } from "./cntris.js";

/* search par input */
let inpt = gebi("nmbrInp");
inpt.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    rsltInp();
  }
});

slctAll(".searchBtn").forEach((el) => {
  el.addEventListener("click", () => {
    rsltInp();
  });
});

function rsltInp() {
  let inptVl = inpt.value;
  if (inptVl.length != 3) {
    gebi("rsltInp").innerHTML = "The code is wrong";
    return;
  }
  gebi("rsltInp").innerHTML = searchCode(inptVl);
}
/* end search par input */




/* jlgggjlgjljkdjksjhkfsfjk 
sdfsdgsfgdfhqsfhdfqsdqdsqfhksd */



/* search par image */

const codeReader = new BrowserMultiFormatReader();

const dropArea = gebi("drop-area");
const imgView = gebi("img-view");

const inputFile = gebi("input-file");
inputFile.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  dropArea.setAttribute("for", "no");
  
  if (!file) {
    gebi("errImg").style.display = "block";
    return
  }
gebi('opNew').style.display = "block";
  const imageUrl = URL.createObjectURL(file);
gebi('uploadedImage').src = imageUrl;
  /* imgView.style.backgroundImage = `url(${imageUrl})`; */
  /* imgView.textContent = ""; */
  gebi('upImg').style.display = "none";
  imgView.style.border = 0;


  const img = new Image();
  img.src = imageUrl;
  
  img.onload = async () => {

    try {
      const r = await codeReader.decodeFromImageElement(img);
      let result = r.text;
      let codeCountry = result.slice(0, 3) * 1;
     showMessage( `Barcode value is : <span id="barCode">${result}</span><br><br> 
${searchCode(codeCountry)}`, 'success') ;
    } catch (err) {
      console.log('fat mna');
      
      fnctn2() 
    }
  };
});

function searchCode(nmbr) {
  for (let i = 0; i < cuntrys.length; i++) {
    let prefix = cuntrys[i].prefix;
    let prefix2 = cuntrys[i].prefix2;
    if (prefix < nmbr && prefix2 > nmbr) {
      let barcode_name = cuntrys[i].barcode_name;

      return ` Country of origin is : <span> ${barcode_name}</span>`;
    }
  }
  return ` Country of origin is Not exist`;
}
gebi('opNew').addEventListener('click', () => {
 inputFile.click();
})
export {  searchCode };