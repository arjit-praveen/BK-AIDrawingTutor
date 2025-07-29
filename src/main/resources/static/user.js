const API = 'http://localhost:8080/api';

async function loadDrawings() {
  const res = await fetch(`${API}/drawings/names`);
  const names = await res.json();
  const select = document.getElementById("drawingSelect");
  select.innerHTML = names.map(n => `<option value="${n}">${n}</option>`).join('');
}

async function loadSteps() {
  const drawing = document.getElementById("drawingSelect").value;
  const res = await fetch(`${API}/drawings/${drawing}/steps`);
  const steps = await res.json();
  const container = document.getElementById("steps");
  container.innerHTML = steps.map(s => `
    <div class="step">
      <p><strong>Step ${s.stepNumber}:</strong> ${s.description}</p>
      <img src="${s.imagePath}" width="200">
    </div>
  `).join('');
}

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

async function loadTopRated() {
  const res = await fetch(`${API}/submissions/top`);
  const top = await res.json();
  const container = document.getElementById("topRated");
  container.innerHTML = top.map(sub => `
    <div class="submission card">
      <img src="${sub.imagePath}" height="80">
      <div>
        <strong>${sub.drawing.name}</strong><br>
        By: ${sub.username}<br>
        Rating: ${sub.rating ?? 'Unrated'}
      </div>
    </div>
  `).join('');
}

// Load everything on page load
loadDrawings();
loadTopRated();