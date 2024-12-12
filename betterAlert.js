document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
    .alert-container {
      position: fixed;
      top: 2vh;
      left: 50%;
      width: fit-content;
      height: fit-content;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center !important;
      align-items: center !important;
      padding: 15px 20px;
      border-radius: 20px;
      z-index: 9999;
      opacity: 0;
      transform: translateX(-50%) translateY(-100%);
      transition: opacity 0.5s ease, transform 1s ease;
      text-align: center;
      max-width: 100svw;
      min-width: 300px;
    }
    .alert-container.open {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .close-alert-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }
    .alert-buttons {
      display: flex;
      width: 100%;
      justify-content: center;
      gap: 10px;
    }
    .alert-buttons button {
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .alert-buttons button.ok {
      background-color: #00bfff;
    }
    .alert-buttons button.yes {
      background-color: #32cd32;
    }
    .alert-buttons button.no {
      background-color: #ff6347;
    }
    .alert-input {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  `;
  document.head.appendChild(style);

  const alertContainer = document.createElement("div");
  alertContainer.className = "alert-container";

  const alertMessageContainer = document.createElement("div");
  const alertTitle = document.createElement("h1");
  const alertText = document.createElement("p");
  const closeAlertButton = document.createElement("button");
  closeAlertButton.innerHTML = "&#10005;";
  closeAlertButton.className = "close-alert-button";

  const alertButtonsContainer = document.createElement("div");
  alertButtonsContainer.className = "alert-buttons";

  let alertOpen = false;

  const closeAlert = () => {
    return new Promise((resolve) => {
      alertContainer.classList.remove("open");
      setTimeout(() => {
        alertTitle.textContent = "";
        alertText.textContent = "";
        alertButtonsContainer.innerHTML = "";
        alertOpen = false;
        resolve();
      }, 1000);
    });
  };

  closeAlertButton.onclick = closeAlert;

  alertContainer.appendChild(alertMessageContainer);
  alertMessageContainer.appendChild(alertTitle);
  alertMessageContainer.appendChild(alertText);
  alertMessageContainer.appendChild(closeAlertButton);
  alertMessageContainer.appendChild(alertButtonsContainer);

  document.body.appendChild(alertContainer);

  window.alertStyles = {
    warning: "#FFC107",
    error: "#E57373",
    success: "#81C784",
    info: "#64B5F6",
  };

  const openAlert = async (
    title,
    text,
    type = 1,
    styleType = "info",
    callback = null
  ) => {
    if (!title || !text) {
      throw new Error("Title and text are required");
    }

    if (alertOpen) {
      console.warn("Alert is already open");
      return;
    }

    alertOpen = true;

    // Set the background color based on the style type
    alertContainer.style.backgroundColor =
      window.alertStyles[styleType] || styleType;

    alertTitle.textContent = title;
    alertText.textContent = text;
    alertContainer.classList.add("open");

    alertButtonsContainer.innerHTML = "";
    closeAlertButton.style.display = "none";

    if (type === 1) {
      const okButton = document.createElement("button");
      okButton.textContent = "OK";
      okButton.className = "ok";
      okButton.onclick = async () => {
        await closeAlert();
      };
      alertButtonsContainer.appendChild(okButton);
    } else if (type === 2) {
      const yesButton = document.createElement("button");
      yesButton.textContent = "Yes";
      yesButton.className = "yes";
      yesButton.onclick = async () => {
        if (callback) callback(true);
        await closeAlert();
      };

      const noButton = document.createElement("button");
      noButton.textContent = "No";
      noButton.className = "no";
      noButton.onclick = async () => {
        if (callback) callback(false);
        await closeAlert();
      };

      alertButtonsContainer.appendChild(yesButton);
      alertButtonsContainer.appendChild(noButton);
    } else if (type === 3) {
      const inputField = document.createElement("input");
      inputField.type = "text";
      inputField.className = "alert-input";

      const submitButton = document.createElement("button");
      submitButton.textContent = "Submit";
      submitButton.className = "ok";
      submitButton.onclick = async () => {
        if (callback) callback(inputField.value);
        await closeAlert();
      };

      alertMessageContainer.appendChild(inputField);
      alertButtonsContainer.appendChild(submitButton);
    } else {
      closeAlertButton.style.display = "block";
    }
  };

  window.openAlert = openAlert;
  window.closeAlert = closeAlert;
});
