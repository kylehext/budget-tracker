// Javascript for modal functionality created through w3schools https://www.w3schools.com/howto/howto_css_modals.asp
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

//Get the goal type select element
var goalTypeSelect = document.getElementById("goal-type-select");

// When the user clicks on the button, open the modal
btn.onclick = function () {
  document.getElementById("goal-form-content")?.remove(); // Remove existing form if any
  document.getElementById("goal-type-select").value = ""; // Reset selection
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Handle goal type selection
goalTypeSelect.addEventListener("change", function () {
  const selectedType = this.value;

  // Remove existing form if any
  const existingForm = document.getElementById("goal-form-content");
  if (existingForm) {
    existingForm.remove();
  }

  // Create new form based on selection
  const formContent = document.createElement("div");
  formContent.id = "goal-form-content";
  formContent.className = "goal-form-content";

  if (selectedType === "budget") {
    formContent.innerHTML = `
    <div class="goal-form-content">
      <h4 class="form-title">Budget Goal</h4>
      <form id="budget-form" method="POST" action="/dashboard">
        <input type="hidden" name="goal_type" value="budget">
        
        <div class="form-group">
          <label for="budget-title">Goal Name:</label>
          <input type="text" id="budget-title" name="title" required>
        </div>
        
        <div class="form-group">
          <label for="budget-description">Description:</label>
          <textarea id="budget-description" name="description"></textarea>
        </div>
        
        <div class="form-group">
          <label for="budget-amount">Budget Amount:</label>
          <input type="number" id="budget-amount" name="target_amount" step="1" required>
        </div>
   
        <button type="submit" class="btn btn-primary">Create Budget Goal</button>
      </form>
    </div>
    `;
  } else if (selectedType === "savings") {
    formContent.innerHTML = `
    <div class="goal-form-content">
      <h4 class="form-title">Savings Goal</h4>
      <form id="savings-form" method="POST" action="/dashboard">
        <input type="hidden" name="goal_type" value="savings">
        <div class="form-group">
          <label for="savings-title">Goal Name:</label>
          <input type="text" id="savings-title" name="title" required>
        </div>
        
        <div class="form-group">
          <label for="savings-description">Description:</label>
          <textarea id="savings-description" name="description"></textarea>
        </div>
        
        <div class="form-group">
          <label for="target-amount">Target Amount:</label>
          <input type="number" id="target-amount" name="target_amount" step="1" required>
        </div>
        
        <div class="form-group">
          <label for="current-amount">Current Amount:</label>
          <input type="number" id="current-amount" name="current_amount" step="1" value="0">
        </div>
        
        <button type="submit" class="btn btn-primary">Create Savings Goal</button>
      </form>
    </div>
    `;
  }

  // Insert the form after the dropdown
  goalTypeSelect.parentElement.appendChild(formContent);

  // Initialize current value to 0 when the form is created or page is refreshed
  window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("current-value").value = 0;
});
});
