function saveFormData(formData) {
  localStorage.setItem('formData', JSON.stringify(formData));
}

function loadFormData() {
  const savedFormData = localStorage.getItem('formData');
  return savedFormData ? JSON.parse(savedFormData) : {};
}

function updateFormFields(formData) {
  Object.keys(formData).forEach(key => {
      const inputElement = document.getElementById(key);
      if (inputElement) {
          inputElement.value = formData[key];
      }
  });
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

  const formData = new FormData(event.target);
  const formDataObject = {};

  formData.forEach((value, key) => {
      formDataObject[key] = value;
  });

  saveFormData(formDataObject); //local storage data 
  generateQRCode(formDataObject); 


}

window.addEventListener("load", () => {
  const form = document.getElementById('scoutingForm');
  const sections = form.querySelectorAll('.section');
  let currentSectionIndex = 0;

  const savedFormData = loadFormData();
  updateFormFields(savedFormData);

  function showSection(index) {
      sections.forEach((section, idx) => {
          if (idx === index) {
              section.classList.add('active');
          } else {
              section.classList.remove('active');
          }
      });
  }

  function nextSection() {
      if (currentSectionIndex < sections.length - 1) {
          currentSectionIndex++;
          showSection(currentSectionIndex);
      }
  }

  function prevSection() {
      if (currentSectionIndex > 0) {
          currentSectionIndex--;
          showSection(currentSectionIndex);
      }
  }

  form.addEventListener('submit', handleSubmit);

  document.getElementById('nextBtn').addEventListener('click', function(event) {
      event.preventDefault();
      nextSection();
  });

  document.getElementById('prevBtn').addEventListener('click', function(event) {
      event.preventDefault();
      prevSection();
  });

  showSection(currentSectionIndex);
});
