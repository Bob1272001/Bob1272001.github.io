function updateFormFields(formData) {
  Object.keys(formData).forEach(key => {
    const inputElement = document.getElementById(key);
    if (inputElement) {
      inputElement.value = formData[key];
    }
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('CSV data copied to clipboard');
    })
    .catch(err => {
      console.error('Failed to copy CSV data to clipboard', err);
    });
}

function generateQRCode(formData) {
  const csvData = `Match Number: ${formData.Match}
Name: ${formData.Name}
Team Number: ${formData.team}
Auto Mobility: ${formData.Mobility ? 'Yes' : 'No'}
Auto Amp Notes Scored: ${formData.Amp}
Auto Amp Notes Missed: ${formData.AmpMissed}
Auto Speaker Notes Scored: ${formData.Speaker}
Auto Speaker Notes Missed: ${formData.SpeakerMissed}
Teleop Amp Notes Scored: ${formData.AmpTeleop}
Teleop Amp Notes Missed: ${formData.AmpTeleopMissed}
Teleop Speaker Notes Scored: ${formData.SpeakerTeleop}
Teleop Speaker Notes Missed: ${formData.SpeakerTeleopMissed}
Defense Played: ${formData.Defense === 'Yes' ? 'Yes' : 'No'}
Penalties: ${formData.Penalties === 'Yes' ? 'Yes' : 'No'}
Comments: ${formData.Comments}`;

  // Generate QR Code from CSV data
  var typeNumber = 14;  // Use a higher type number for larger data capacity
  var errorCorrectionLevel = 'L';  // Use highest error correction level for robustness
  var qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.addData(csvData);
  qr.make();

  var qrCodeSvg = qr.createSvgTag({ cellSize: 6, margin: 2 });

  document.getElementById('qrcode').innerHTML = qrCodeSvg;
  document.getElementById('qrcode').style.display = 'block';  // Ensure the QR code is visible
  document.getElementById('qrcode').style.width = '100%';  // Make QR code div larger
  document.getElementById('qrcode').style.height = 'auto';  // Maintain aspect ratio

  // Copy CSV data to clipboard
  copyToClipboard(csvData);
}

function clearFormData() {
  localStorage.removeItem('formData');
}

function nextSection() {
  const currentSection = document.querySelector('.section.active');
  const nextSection = currentSection.nextElementSibling;

  currentSection.classList.remove('active');
  nextSection.classList.add('active');
}

function prevSection() {
  const currentSection = document.querySelector('.section.active');
  const prevSection = currentSection.previousElementSibling;

  currentSection.classList.remove('active');
  prevSection.classList.add('active');
}

function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formDataObject = {};

  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  generateQRCode(formDataObject); 

  document.getElementById('scoutingForm').style.display = 'none';
  document.getElementById('qrcode').style.display = 'block';

  document.getElementById('submitAnotherFormBtn').style.display = 'block';
}

function submitAnotherForm() {
  localStorage.removeItem('formData');
  document.getElementById('scoutingForm').reset();
  document.getElementById('section1').classList.add('active');

  document.getElementById('scoutingForm').style.display = 'block';
  document.getElementById('qrcode').style.display = 'none';
  document.getElementById('qrcode').innerHTML = '';

  document.getElementById('submitAnotherFormBtn').style.display = 'none';
}

window.addEventListener("load", () => {
  const form = document.getElementById('scoutingForm');
  const sections = form.querySelectorAll('.section');

  let currentSectionIndex = 0;

  function showSection(index) {
    sections.forEach((section, idx) => {
      if (idx === index) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  }

  function nextSectionHandler() {
    if (currentSectionIndex < sections.length - 1) {
      currentSectionIndex++;
      showSection(currentSectionIndex);
    }
  }

  function prevSectionHandler() {
    if (currentSectionIndex > 0) {
      currentSectionIndex--;
      showSection(currentSectionIndex);
    }
  }

  form.addEventListener('submit', handleSubmit);

  document.querySelectorAll('.nextBtn').forEach(btn => {
    btn.addEventListener('click', function(event) {
      event.preventDefault();
      nextSectionHandler();
    });
  });

  document.querySelectorAll('.prevBtn').forEach(btn => {
    btn.addEventListener('click', function(event) {
      event.preventDefault();
      prevSectionHandler();
    });
  });

  showSection(currentSectionIndex);

  document.getElementById('submitAnotherFormBtn').addEventListener('click', function(event) {
    event.preventDefault();
    submitAnotherForm();
  });
});
