// Dark / Light Mode
function toggleMode() {
  document.body.classList.toggle("bg-dark");
  document.body.classList.toggle("text-white");
}

// Dynamic Text
function changeText() {
  document.getElementById("dynamicText").innerText =
    "🔥 You clicked the button! Welcome to my portfolio.";
}

// Show/Hide Section
function toggleSection() {
  let section = document.getElementById("extraSection");
  section.style.display =
    section.style.display === "none" ? "block" : "none";
}

// Add Skill
function addSkill() {
  let list = document.getElementById("skillList");
  let li = document.createElement("li");
  li.className = "list-group-item";
  li.innerText = "New Skill";
  list.appendChild(li);
}

// Remove Skill
function removeSkill() {
  let list = document.getElementById("skillList");
  if (list.lastElementChild) {
    list.removeChild(list.lastElementChild);
  }
}

// Form Validation
function validateForm(event) {
  event.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || message === "") {
    alert("❌ Please fill all fields!");
    return false;
  }

  alert("✅ Message sent successfully!");
  return true;
}

// Alert
function showAlert() {
  alert("Welcome to Abir Hasan's Portfolio 🚀");
}