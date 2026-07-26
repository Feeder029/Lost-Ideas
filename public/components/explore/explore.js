function initExplore() {
    const difficultyValue = document.getElementById("difficulty-value");
    const sortValue = document.getElementById("sort-value");

    const ideaForm = document.getElementById("idea-form-container");
    const ideaOpenBtn = document.getElementById("btn-idea-open");
    const ideaCloseBtn = document.getElementById("btn-idea-close");

    const cardDetailsCard = document.getElementById("card-details-container");
    const cardAdoptBtn = document.getElementById("btn-adopt");
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
        ideaForm.classList.add("show");
        document.body.classList.add("no-scroll");
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

    cardAdoptBtn.addEventListener("click", () => {
        cardDetailsCard.classList.add("show");
        document.body.classList.add("no-scroll");
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
}

