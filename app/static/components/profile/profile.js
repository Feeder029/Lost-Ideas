const statButtons = document.querySelectorAll(".profile-stats-row");
const ideasContainer = document.querySelector(".ideas-container");

statButtons.forEach(button => {
    button.addEventListener("click", () => {
        ideasContainer.classList.toggle("show");
    });
});