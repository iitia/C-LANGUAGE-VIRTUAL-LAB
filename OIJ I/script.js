function checkAnswersI() {
  const correctAnswers = {
    q1: "b",
    q2: "b",
    q3: "a",
    q4: "b",
    q5: "a"
  };

  let score = 0;
  let total = Object.keys(correctAnswers).length;

  for (let key in correctAnswers) {
    const options = document.querySelectorAll(`input[name="${key}"]`);
    options.forEach(option => {
      const label = option.parentElement;
      label.style.color = ""; // Reset any previous color

      if (option.checked) {
        if (option.value === correctAnswers[key]) {
          label.style.color = "green";
          score++;
        } else {
          label.style.color = "red";
        }
      }
    });
  }

  document.getElementById("result").innerText = `${score} out of ${total}`;
}


function checkAnswers1() {
  const correctAnswers = {
    q1: "b",
    q2: "a",
    q3: "c",
    q4: "b",
    q5: "b"
  };

  let score = 0;
  let total = Object.keys(correctAnswers).length;

  for (let key in correctAnswers) {
    const options = document.querySelectorAll(`input[name="${key}"]`);
    options.forEach(option => {
      const label = option.parentElement;
      label.style.color = ""; // Reset any previous color

      if (option.checked) {
        if (option.value === correctAnswers[key]) {
          label.style.color = "green";
          score++;
        } else {
          label.style.color = "red";
        }
      }
    });
  }

  document.getElementById("result").innerText = `${score} out of ${total}`;
}









const menuToggle = document.getElementById('menuToggle');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');

menuToggle.onclick = () => {
  modalOverlay.style.display = 'flex';
};

closeModal.onclick = () => {
  modalOverlay.style.display = 'none';
};

// Optional: Close modal on click outside the modal box
window.onclick = (event) => {
  if (event.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
};





let steps = [];
let currentStep = 0;
let resultValue= null;

window.onload = function () {
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
};

function start() {
  const op = document.getElementById("operation").value;
  const num1 = parseFloat(document.getElementById("num1").value);
  const num2 = parseFloat(document.getElementById("num2").value);
  const stepsDiv = document.getElementById("steps");
  const resultDiv = document.getElementById("result");

  stepsDiv.innerHTML = "";
  resultDiv.innerHTML = "Output :";
  steps = [];
  currentStep = 0;

  if (!op || isNaN(num1) || isNaN(num2)) {
    alert("Please select an operation and enter both numbers.");
    return;
  }

  document.querySelector(".start").disabled = true;
  document.querySelector(".next").disabled = false;
  document.querySelector(".reset").disabled = false;

  switch (op) {
    case "add":
      steps.push(`a=int(input('Enter a number'))`);
      steps.push(`b=int(input('Enter a number'))`);
      steps.push(`c=a+b`);
      steps.push(`print("The addition is: ",c)`);
      resultValue=num1+num2;
      break;
    case "subtract":
      steps.push(`Take ${num1} and ${num2}`);
      steps.push(`Subtract them: ${num1} - ${num2}`);
      steps.push(`Result = ${num1 - num2}`);
      break;
    case "multiply":
      steps.push(`Take ${num1} and ${num2}`);
      steps.push(`Multiply them: ${num1} * ${num2}`);
      steps.push(`Result = ${num1 * num2}`);
      break;
    case "divide":
      if (num2 === 0) {
        steps.push("Cannot divide by zero.");
      } else {
        steps.push(`Take ${num1} and ${num2}`);
        steps.push(`Divide them: ${num1} / ${num2}`);
        steps.push(`Result = ${num1 / num2}`);
      }
      break;
  }

  // Display all steps
  stepsDiv.innerHTML = steps
    .map((step, i) => `<p id="step-${i}">${step}</p>`)
    .join("");
}

function nextStep() {
  if (currentStep < steps.length) {
    // Un-highlight previous step
    const prevStep = document.getElementById(`step-${currentStep - 1}`);
    if (prevStep) prevStep.style.backgroundColor = "";

    // Highlight current step
    const step = document.getElementById(`step-${currentStep}`);
    step.style.backgroundColor = "lightyellow";

    // Handle last step for result panel
    if (currentStep === steps.length - 1) {
      const lastStep = step.textContent.trim();

      if (lastStep.startsWith("print(") && lastStep.endsWith(")")) {
        // Extract content inside print(...)
        const innerContent = lastStep.substring(
          lastStep.indexOf("(") + 1,
          lastStep.lastIndexOf(")")
        );

        // Remove quotes and commas
        let cleaned = innerContent.replace(/['"]/g, "").replace(/,/g, "");

        // Replace 'c' with the actual result value
        cleaned = cleaned.replace("c", resultValue);

        // Show the clean output
        document.getElementById("result").textContent =
          "Output : " + cleaned.trim();
      }
    }

    currentStep++;
  }
}

function reset() {
  document.getElementById("operation").selectedIndex=0;
  document.getElementById("num1").value = "";
  document.getElementById("num2").value = "";
  document.getElementById("steps").innerHTML = "";
  document.getElementById("result").textContent = "Output :";
  steps = [];
  currentStep = 0;
}
