const passwordInput = document.getElementById("password-input");
const submitButton = document.getElementById("submit-button");
const errorMessage = document.getElementById("error-message");
const title = document.getElementById("title");
const instruction = document.getElementById("instruction");
const resetButton = document.getElementById("reset-button");
const resetPasswordContainer = document.getElementById("reset-password-container");
const currentPasswordInput = document.getElementById("current-password-input");
const resetPasswordButton = document.getElementById("reset-password-button");
const resetErrorMessage = document.getElementById("reset-error-message");
const setPasswordContainer = document.getElementById("set-password-container");
const backButton = document.getElementById("back-button");

// Check if a password is already set
chrome.storage.sync.get("password", (data) => {
  if (data.password) {
    title.textContent = "Enter Password";
    instruction.textContent = "Enter password to continue:";
    submitButton.textContent = "Unlock";
    resetButton.style.display = "inline-block";
  } else {
    title.textContent = "Set Password";
    instruction.textContent = "Enter new password for set up:";
    submitButton.textContent = "Set Password";
    resetButton.style.display = "none";
  }
});

submitButton.addEventListener("click", () => {
  const enteredPassword = passwordInput.value;

  if (!enteredPassword) {
    errorMessage.textContent = "Password cannot be empty.";
    errorMessage.style.display = "block";
    return;
  }

  chrome.storage.sync.get("password", (data) => {
    if (data.password) {
      if (enteredPassword === data.password) {
        chrome.runtime.sendMessage({ action: "unblock" }, (response) => {
          if (response.status === "unblocked") {
            window.close();
          }
        });
      } else {
        errorMessage.textContent = "Incorrect password. Try again.";
        errorMessage.style.display = "block";
      }
    } else {
      chrome.storage.sync.set({ password: enteredPassword }, () => {
        instruction.textContent = "Password set successfully!";
        submitButton.textContent = "Unlock";
        title.textContent = "Enter Password";
        errorMessage.style.display = "none";
        passwordInput.value = "";
        resetButton.style.display = "inline-block";
      });
    }
  });
});

// Reset password page
resetButton.addEventListener("click", () => {
  setPasswordContainer.style.display = "none";
  resetPasswordContainer.style.display = "block";
  instruction.style.display = "none"
  title.style.display = "none"
});

// Handle password reset request
resetPasswordButton.addEventListener("click", () => {
  const currentPassword = currentPasswordInput.value;

  if (!currentPassword) {
    resetErrorMessage.textContent = "Please enter current password.";
    resetErrorMessage.style.display = "block";
    return;
  }

  chrome.storage.sync.get("password", (data) => {
    if (data.password === currentPassword) {
      if (confirm("Are you sure you want to reset your password?")) {
        chrome.storage.sync.remove("password", () => {
          instruction.style.display = "block"
          title.style.display = "block"
          title.textContent = "Set Password";
          instruction.textContent = "Enter new password for set up:";
          submitButton.textContent = "Set Password";
          setPasswordContainer.style.display = "block"; 
          resetPasswordContainer.style.display = "none"; 
          resetButton.style.display = "none";
          currentPasswordInput.value = "";
          resetErrorMessage.style.display = "none";
          alert("Password has been reset. Please set new one.");
        });
      }
    } else {
      resetErrorMessage.textContent = "Incorrect current password. Try again.";
      resetErrorMessage.style.display = "block";
    }
  });
});

backButton.addEventListener("click", () => {
  instruction.style.display = "block"
  title.style.display = "block"
  setPasswordContainer.style.display = "block"; 
  resetPasswordContainer.style.display = "none";
});