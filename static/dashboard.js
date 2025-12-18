// Javascript for modal functionality created through w3schools https://www.w3schools.com/howto/howto_css_modals.asp
// Progress bar functionality and database management created with help from claude.ai

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
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 5px; font-weight: bold;">$</span>
            <input type="number" id="budget-amount" name="target_amount" step="1" value="0" required style="max-width: 200px;">
          </div>
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
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 5px; font-weight: bold;">$</span>
            <input type="number" id="target-amount" name="target_amount" step="1" value="0" required style="max-width: 200px;">
          </div>
        </div>
        
        <div class="form-group">
          <label for="current-amount">Current Amount:</label>
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 5px; font-weight: bold;">$</span>
            <input type="number" id="current-amount" name="current_amount" step="1" value="0" style="max-width: 200px;">
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary">Create Savings Goal</button>
      </form>
    </div>
    `;
  }

  // Insert the form after the dropdown
  goalTypeSelect.parentElement.appendChild(formContent);
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Set all current-value inputs to 0
  document.querySelectorAll("#current-value").forEach((input) => {
    input.value = "0";
  });

  // Progress bar functionality created with help from claude.ai
  // Function to update progress bar
  function updateProgressBar(goalCard, currentAmount, targetAmount) {
    const progressFill = goalCard.querySelector(".progress-bar-fill");
    const progressPercentage = goalCard.querySelector(".progress-percentage");
    const currentAmountDisplay = goalCard.querySelector(".current-amount");
    const goalAmountDisplay = goalCard.querySelector(".goal-amount");
    const goalType = goalCard.dataset.goalType; // Get goal type from data attribute

    const percentage =
      targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
    const displayPercentage = Math.min(percentage, 100);

    // Update the fill height
    progressFill.style.height = displayPercentage + "%";

    // Update percentage text
    progressPercentage.textContent = Math.round(percentage) + "%";

    // Update current amount display (for savings goals)
    if (currentAmountDisplay) {
      currentAmountDisplay.textContent = `Current Amount: $${currentAmount.toFixed(
        2
      )}`;
    }

    // Update the goal amount display based on goal type
    if (goalAmountDisplay) {
      const remaining = targetAmount - currentAmount;

      if (goalType === "budget") {
        goalAmountDisplay.textContent = `Budget Remaining: $${remaining.toFixed(
          2
        )}`;
      } else if (goalType === "savings") {
        goalAmountDisplay.textContent = `Left to Save: $${remaining.toFixed(
          2
        )}`;
      }
    }

    // Add/remove over-goal class
    if (percentage > 100) {
      progressFill.classList.add("over-goal");
    } else {
      progressFill.classList.remove("over-goal");
    }

    // Update data attributes
    progressFill.dataset.current = currentAmount;
  }

  // Handle increment button - adds $1 to the input value
  document.querySelectorAll(".increment").forEach((button) => {
    button.addEventListener("click", function () {
      const goalCard = this.closest(".goal-card");
      const input = goalCard.querySelector("#current-value");
      const currentValue = parseFloat(input.value) || 0;
      input.value = (currentValue + 1).toFixed(2);
    });
  });

  // Handle decrement button - subtracts $1 from the input value
  document.querySelectorAll(".decrement").forEach((button) => {
    button.addEventListener("click", function () {
      const goalCard = this.closest(".goal-card");
      const input = goalCard.querySelector("#current-value");
      const currentValue = parseFloat(input.value) || 0;
      input.value = (currentValue - 1).toFixed(2);
    });
  });

  // Handle confirm button - updates the progress bar with the new value
  document.querySelectorAll(".confirm-value").forEach((button) => {
    button.addEventListener("click", function () {
      const goalCard = this.closest(".goal-card");
      const input = goalCard.querySelector("#current-value");
      const progressFill = goalCard.querySelector(".progress-bar-fill");
      const goalId = goalCard.dataset.goalId;

      const currentAmount = parseFloat(progressFill.dataset.current) || 0;
      const targetAmount = parseFloat(progressFill.dataset.target) || 0;
      const changeAmount = parseFloat(input.value) || 0;

      // Calculate new amount
      const newAmount = currentAmount + changeAmount;

      // Update progress bar visually
      updateProgressBar(goalCard, newAmount, targetAmount);

      // Reset input to 0
      input.value = "0.00";

      // Send update to backend to persist the change
      fetch(`/update-goal/${goalId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_amount: newAmount,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Goal updated successfully");
          } else {
            console.error("Failed to update goal");
            alert("Failed to update goal. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        });
    });
  });

  // Handle delete button - deletes the goal
  document.querySelectorAll(".delete-goal").forEach((button) => {
    button.addEventListener("click", function () {
      const goalCard = this.closest(".goal-card");
      const goalId = goalCard.dataset.goalId;

      // Confirm deletion
      if (confirm("Are you sure you want to delete this goal?")) {
        // Send delete request to backend
        fetch(`/delete-goal/${goalId}`, {
          method: "POST",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              goalCard.remove();
              console.log("Goal deleted successfully");

              // Check if there are no more goals and reload page to show "no goals" message
              const remainingGoals = document.querySelectorAll(".goal-card");
              if (remainingGoals.length === 0) {
                location.reload();
              }
            } else {
              console.error("Failed to delete goal");
              alert("Failed to delete goal. Please try again.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
          });
      }
    });
  });
});
