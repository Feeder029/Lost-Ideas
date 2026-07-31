const statButtons = document.querySelectorAll(".profile-stats-row");
const ideasContainer = document.querySelector(".ideas-container");

let previousScrollPosition = 0;

statButtons.forEach(button => {
    button.addEventListener("click", () => {

        const isOpening = !ideasContainer.classList.contains("show");

        if (isOpening) {

            previousScrollPosition = window.scrollY;

            ideasContainer.classList.add("show");

            setTimeout(() => {
                window.scrollBy({
                    top: 180,
                    behavior: "smooth"
                });
            }, 150);

        } else {
            ideasContainer.classList.remove("show");

            setTimeout(() => {
                window.scrollTo({
                    top: previousScrollPosition,
                    behavior: "smooth"
                });
            }, 150);
        }
    });
});