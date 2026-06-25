function checkAnswersI() {
  const correctAnswers = { q1: "b", q2: "b", q3: "b", q4: "b", q5: "a" };
  let score = 0;
  const total = Object.keys(correctAnswers).length;
  for (let key in correctAnswers) {
    document.querySelectorAll(`input[name="${key}"]`).forEach(option => {
      const label = option.parentElement;
      label.style.color = "";
      if (option.checked) {
        label.style.color = option.value === correctAnswers[key] ? "green" : "red";
        if (option.value === correctAnswers[key]) score++;
      }
    });
  }
  document.getElementById("result").innerText = `${score} out of ${total}`;
}

function checkAnswers1() {
  checkAnswersI();
}

const menuToggle = document.getElementById('menuToggle');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');

if (menuToggle) menuToggle.onclick = () => { modalOverlay.style.display = 'flex'; };
if (closeModal) closeModal.onclick = () => { modalOverlay.style.display = 'none'; };
if (modalOverlay) window.onclick = (event) => {
  if (event.target === modalOverlay) modalOverlay.style.display = 'none';
};
