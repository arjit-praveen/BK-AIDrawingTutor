const API_BASE = "http://localhost:8080/api";
let currentDrawingName = "";

async function createDrawing() {
  const name = document.getElementById("drawingName").value;
  const description = document.getElementById("drawingDesc").value;

  const res = await fetch(`${API_BASE}/drawings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description })
  });

  if (res.ok) {
    alert("Drawing created. Now add steps.");
    document.getElementById("stepsContainer").style.display = "block";
    generateStepForms(name);
    loadDrawings();
  } else {
    alert("Failed to create drawing (maybe already exists?)");
  }
}

function generateStepForms(drawingName) {
  currentDrawingName = drawingName;
  const stepForms = document.getElementById("stepForms");
  stepForms.innerHTML = "";
  addStepField();
}

function addStepField() {
  const stepForms = document.getElementById("stepForms");
  const index = stepForms.children.length + 1;
  const container = document.createElement("div");
  container.className = "step-container";
  container.innerHTML = `
    <h4>Step ${index}</h4>
    <label>Step Number:</label>
    <input type="number" min="1" required class="step-num">
    <label>Description:</label>
    <input type="text" required class="step-desc">
    <label>Upload Image:</label>
    <input type="file" accept="image/*" required class="step-img">
  `;
  stepForms.appendChild(container);
}

async function submitSteps() {
  const stepForms = document.querySelectorAll(".step-container");

  for (const container of stepForms) {
    const stepNumber = container.querySelector(".step-num").value;
    const description = container.querySelector(".step-desc").value;
    const imageFile = container.querySelector(".step-img").files[0];

    if (!stepNumber || !description || !imageFile) {
      alert("Please fill all fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("drawingName", currentDrawingName);
    formData.append("stepNumber", stepNumber);
    formData.append("description", description);
    formData.append("image", imageFile);

    await fetch(`${API_BASE}/steps`, {
      method: "POST",
      body: formData
    });
  }

  alert("Steps uploaded!");
  document.getElementById("stepsContainer").style.display = "none";
  loadDrawings();
}

async function loadDrawings() {
  const res = await fetch(`${API_BASE}/drawings`);
  const drawings = await res.json();

  const container = document.getElementById("drawingList");
  container.innerHTML = "";

  for (const drawing of drawings) {
    const stepsRes = await fetch(`${API_BASE}/drawings/${drawing.name}/steps`);
    const steps = await stepsRes.json();

    const stepsId = `steps-${drawing.id}`;
    let stepHtml = steps.map(s => `
      <li>
        <strong>Step ${s.stepNumber}:</strong> ${s.description}<br>
        <img src="${s.imagePath}" width="100">
      </li>
    `).join("");

    container.innerHTML += `
      <div class="drawing-card">
        <h3 style="display:flex; justify-content:space-between; align-items:center;">
          ${drawing.name}
          <button style="width:auto; padding:4px 8px; background:#eee; color:#333;" onclick="toggleSteps('${stepsId}', this)">⬇</button>
        </h3>
        <p>${drawing.description}</p>
        <div class="steps-content" id="${stepsId}">
          <ul>${stepHtml}</ul>
        </div>
        <div class="button-group">
          <button onclick="generateStepForms('${drawing.name}'); document.getElementById('stepsContainer').style.display = 'block';">+ Add Steps</button>
          <button style="background:#e74c3c;" onclick="deleteDrawing(${drawing.id})">🗑️ Delete</button>
        </div>
      </div>
    `;
  }
}

function toggleSteps(id, btn) {
  const section = document.getElementById(id);
  if (section.style.display === "none" || section.style.display === "") {
    section.style.display = "block";
    btn.textContent = "⬆";
  } else {
    section.style.display = "none";
    btn.textContent = "⬇";
  }
}

async function deleteDrawing(id) {
  if (!confirm("Are you sure you want to delete this drawing?")) return;
  await fetch(`${API_BASE}/drawings/${id}`, { method: "DELETE" });
  alert("Deleted.");
  loadDrawings();
}

async function loadSubmissions() {
  const res = await fetch(`${API_BASE}/submissions`);
  const subs = await res.json();
  const container = document.getElementById("submissionList");
  container.innerHTML = "";

  for (const sub of subs) {
    container.innerHTML += `
      <div class="submission-card">
        <p><strong>Drawing:</strong> ${sub.drawing.name}</p>
        <img src="${sub.imagePath}" width="150"><br>
        <div class="rating">
          <label for="rating-${sub.id}">Rate this:</label>
          <select id="rating-${sub.id}" onchange="rateSubmission(${sub.id}, this.value)">
            <option value="">-- Rate --</option>
            ${[1,2,3,4,5].map(i => `<option value="${i}" ${sub.rating === i ? "selected" : ""}>${i}</option>`).join("")}
          </select>
        </div>
      </div>
    `;
  }
}

async function rateSubmission(id, rating) {
  await fetch(`${API_BASE}/submissions/${id}/rate`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating: parseInt(rating) })
  });
  alert("Rating submitted.");
  loadSubmissions();
}

// Load everything
loadDrawings();
loadSubmissions();