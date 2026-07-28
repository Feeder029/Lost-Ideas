function initExplore() {
    const difficultyValue = document.getElementById("difficulty-value");
    const sortValue = document.getElementById("sort-value");

    const ideaForm = document.getElementById("idea-form-container");
    const ideaOpenBtn = document.getElementById("btn-idea-open");
    const ideaCloseBtn = document.getElementById("btn-idea-close");

    const cardDetailsCard = document.getElementById("card-details-container");
    const cardAdoptBtns = document.querySelectorAll(".btn-adopt");
    const cardDetailsBtn = document.getElementById("btn-card-details-close");

    document.querySelectorAll('input[name="diff"]').forEach(radio => {
        radio.addEventListener("change", () => {
            difficultyValue.textContent = radio.value;
        });
    });

    document.querySelectorAll('input[name="sortby"]').forEach(radio => {
        radio.addEventListener("change", () => {
            sortValue.textContent = radio.value;
        });
    });

    ideaOpenBtn.addEventListener("click", () => {
        if (ideaOpenBtn.dataset.authenticated === "true") {
            ideaForm.classList.add("show");
            document.body.classList.add("no-scroll");
        } else {
            window.location.href = "/auth"
        }
    });

    ideaCloseBtn.addEventListener("click", () => {
        ideaForm.classList.remove("show");
        document.body.classList.remove("no-scroll");
    });

    ideaForm.addEventListener("click", (e) => {
        if(e.target === ideaForm) {
            ideaForm.classList.remove("show");
            document.body.classList.remove("no-scroll");
        }
    });

    cardDetailsBtn.addEventListener("click",() => {
        cardDetailsCard.classList.remove("show");
        document.body.classList.remove("no-scroll");
    });

    cardDetailsCard.addEventListener("click", (e) => {
        if(e.target === cardDetailsCard) {
            cardDetailsCard.classList.remove("show");
            document.body.classList.remove("no-scroll");
        }
    });

    document.querySelectorAll(".card-title").forEach(title => {
        const len = title.textContent.trim().length;

        if (len > 100) {
            title.style.fontSize = "0.8rem";
        } else if (len > 70) {
            title.style.fontSize = "0.9rem";
        } else {
            title.style.fontSize = "1.3rem";
        }
    });

    cardAdoptBtns.forEach(btn => {

        btn.addEventListener("click", () => {

            document.getElementById("card-details-number").textContent = "#" + String(btn.dataset.id).padStart(5, "0");

            document.getElementById("card-details-title").textContent = `${btn.dataset.icon} ` + btn.dataset.title;

            document.getElementById("card-details-difficulty").textContent = "Difficulty • " + btn.dataset.difficulty;

            document.getElementById("card-details-description").textContent = btn.dataset.description;

            document.getElementById("card-details-posted").textContent = "Posted " + btn.dataset.posted;

            cardDetailsCard.classList.add("show");
            document.body.classList.add("no-scroll");
        });

    });
}

initExplore();