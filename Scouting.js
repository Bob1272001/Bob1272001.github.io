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

  // Hide the form to display QR code prominently
  document.getElementById('scoutingForm').style.display = 'none';
}

function clearFormData() {
  localStorage.removeItem('formData');
}

function nextSection() {
  const currentSection = document.querySelector('.section.active');
  const nextSection = currentSection.nextElementSibling;

  currentSection.classList.remove('active');
  if (nextSection) {
    nextSection.classList.add('active');
  }
}

function prevSection() {
  const currentSection = document.querySelector('.section.active');
  const prevSection = currentSection.previousElementSibling;

  currentSection.classList.remove('active');
  if (prevSection) {
    prevSection.classList.add('active');
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formDataObject = {};

  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  // Calculate total made shots for Auto
  formDataObject.totalAutoMadeShots = 
  (parseInt(formDataObject.Amp || 0) + parseInt(formDataObject.Speaker || 0));

  // Calculate total made shots for Teleop
  formDataObject.totalTeleopMadeShots = 
  (parseInt(formDataObject.AmpTeleop || 0) + parseInt(formDataObject.SpeakerTeleop || 0));


  // Set Mobility value to 1 if checked, otherwise 0
  formDataObject.Mobility = document.getElementById('Mobility').checked ? 1 : 0;

  // Handle Endgame: Allow multiple selections
  formDataObject.Parked = document.querySelector('input[name="Endgame"][value="Parked"]').checked ? 1 : 0;
  formDataObject.Climbed = document.querySelector('input[name="Endgame"][value="Climbed"]').checked ? 1 : 0;
  formDataObject.Trap = document.querySelector('input[name="Endgame"][value="Trap"]').checked ? 1 : 0;

  // Add Disabled and Under Stage fields
  formDataObject.Disabled = document.getElementById('Disabled').checked ? 1 : 0;
  formDataObject.UnderStage = document.getElementById('UnderStage').checked ? 1 : 0;

  // Concatenate Scouter Name with Comments
  formDataObject.Comments = `${formDataObject.Name}: ${formDataObject.Comments}`;

  generateQRCode(formDataObject);
  saveFormData(formDataObject); 
  clearFormData();

  document.getElementById('submitAnotherFormBtn').style.display = 'block';
}

function submitAnotherForm() {
  localStorage.removeItem('formData');
  document.getElementById('scoutingForm').reset();
  document.getElementById('section1').classList.add('active');
  document.querySelectorAll('.section').forEach((section, idx) => {
    if (idx !== 0) {
      section.classList.remove('active');
    }
  });
  
  document.getElementById('scoutingForm').style.display = 'block';
  
  document.getElementById('submitAnotherFormBtn').style.display = 'none';
  document.getElementById('qrcode').style.display = 'none';
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

  // Bind click event to Submit Another Form button
  document.getElementById('submitAnotherFormBtn').addEventListener('click', function(event) {
    event.preventDefault();
    submitAnotherForm();
  });
});
