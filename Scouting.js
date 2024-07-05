
function ButtonClicked (){
    console.log("Hi");
    console.log("Hello");
    const x = 5;
    console.log(x);
}

function generateQRCode(formData) {
  const jsonData = JSON.stringify(formData);

  // Generate QR Code from JSON data
  var typeNumber = 20;
  var errorCorrectionLevel = 'L';
  var qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.addData(jsonData);
  qr.make();

  var qrCodeSvg = qr.createSvgTag();

  document.getElementById('qrcode').innerHTML = qrCodeSvg;
}
  function handleSubmit(event) {
    event.preventDefault();
  
    const data = new FormData(event.target);
  
    // Do a bit of work to convert the entries to a plain JS object
    const value = Object.fromEntries(data.entries());
    
    console.log(JSON.stringify(value));
  }

  window.addEventListener("load", () => {  
    const form = document.getElementById('scoutingForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const formDataObject = {};
        
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        generateQRCode(formDataObject);
    });
});
  