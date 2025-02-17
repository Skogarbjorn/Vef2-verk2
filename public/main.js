document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quiz-form");
  const questions = Array.from(form.querySelectorAll(".question"));
  const submitButton = document.getElementById("submit-button");

  updateSubmitButtonState();
  form.addEventListener("change", updateSubmitButtonState);

  function updateSubmitButtonState() {
    const allAnswered = questions.every((question) => {
      return question.querySelector('input[type="radio"]:checked');
    });
    submitButton.disabled = !allAnswered;
  }
});
