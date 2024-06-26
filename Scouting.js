
function ButtonClicked (){
    console.log("Hi");
    console.log("Hello");
    const x = 5;
    console.log(x);
}

function generateQRCode() {

    var Amp = document.getElementById('Amp').value;
    var AmpMissed = document.getElementById('AmpMissed').value;
    var Speaker = document.getElementById('Speaker').value;
    var SpeakerMissed = document.getElementById('SpeakerMissed').value;

    var data = Amp + ', ' + AmpMissed + ', ' + Speaker + ', ' + SpeakerMissed;

    console.log(data);

    var typeNumber = 20;
    var errorCorrectionLevel = 'L';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(data);
    qr.make();

    var qrCodeSvg = qr.createSvgTag();

    document.getElementById('qrcode').innerHTML = qrCodeSvg;
  }