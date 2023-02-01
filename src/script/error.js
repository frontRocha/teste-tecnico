const errorMessage = document.getElementById("error-message");
const errorMessageText = document.getElementById("error-message-text");

function showErrorMessage(message) {
  errorMessageText.textContent = message;
  errorMessage.style.visibility = "visible";
}

function hideErrorMessage() {
  errorMessage.style.visibility = "hidden";
}