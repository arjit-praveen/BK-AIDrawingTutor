const API = 'http://localhost:8080/api';

let currentStepIndex = 0;
let stepsData = [];

// Load drawings into dropdown
async function loadDrawings() {
  const res = await fetch(`${API}/drawings/names`);
  const names = await res.json();
  const select = document.getElementById("drawingSelect");
  select.innerHTML = names.map(n => `<option value="${n}">${n}</option>`).join('');
}

// Load steps for selected drawing
async function loadSteps() {
  const drawing = document.getElementById("drawingSelect").value;
  const res = await fetch(`${API}/drawings/${drawing}/steps`);
  stepsData = await res.json();
  currentStepIndex = 0;
  renderStep();
}

// Render current step
function renderStep() {
  const container = document.getElementById("steps");
  if (stepsData.length === 0) {
    container.innerHTML = "<p>No steps available.</p>";
    return;
  }

  const step = stepsData[currentStepIndex];
  container.innerHTML = `
    <div class="step-carousel">
      <button class="nav-btn left" onclick="prevStep()">&#8592;</button>
      <div class="step-content">
        <img src="${step.imagePath}" alt="Step Image">
        <p><strong>Step ${step.stepNumber}:</strong> ${step.description}</p>
        <p class="step-count">Step ${currentStepIndex + 1} / ${stepsData.length}</p>
        <div class="jump-box">
          <label>Go to step:</label>
          <input type="number" min="1" max="${stepsData.length}" onchange="jumpToStep(this.value)">
        </div>
      </div>
      <button class="nav-btn right" onclick="nextStep()">&#8594;</button>
    </div>
  `;
}

// Navigate steps
function prevStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderStep();
  }
}

function nextStep() {
  if (currentStepIndex < stepsData.length - 1) {
    currentStepIndex++;
    renderStep();
  }
}

function jumpToStep(value) {
  const index = parseInt(value) - 1;
  if (index >= 0 && index < stepsData.length) {
    currentStepIndex = index;
    renderStep();
  } else {
    alert(`Please enter a number between 1 and ${stepsData.length}`);
  }
}

// Submit user drawing
async function submitDrawing() {
  const drawingName = document.getElementById("drawingSelect").value;
  const image = document.getElementById("userImage").files[0];
  if (!image) return alert("Please choose an image");

  const username = prompt("Enter your name:");
  if (!username) return alert("Submission cancelled (no name)");

  const form = new FormData();
  form.append("drawingName", drawingName);
  form.append("username", username);
  form.append("image", image);

  const res = await fetch(`${API}/submit`, {
    method: 'POST',
    body: form
  });

  if (res.ok) {
    alert("Submission received!");
    loadTopRated();
  } else {
    alert("Submission failed!");
  }
}

// Load top rated submissions
async function loadTopRated() {
  const res = await fetch(`${API}/submissions/top`);
  const top = await res.json();
  const container = document.getElementById("topRated");

  container.innerHTML = top.map(sub => {
    const stars = "⭐".repeat(sub.rating ?? 0);
    return `
      <div class="submission card">
        <img src="${sub.imagePath}" onclick="openModal('${sub.imagePath}')">
        <strong>${sub.drawing.name}</strong><br>
        By: ${sub.username}<br>
        <span class="stars">${stars}</span>
      </div>
    `;
  }).join('');
}

// Modal functions
function openModal(src) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modal.style.display = "block";
  modalImg.src = src;
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

// Load on page load
loadDrawings();
loadTopRated();
