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
            document.getElementById("card-details-idea-id").value = btn.dataset.id;

            document.getElementById("card-details-number").textContent = "#" + String(btn.dataset.id).padStart(5, "0");
            
            document.getElementById("card-profile-name").textContent = btn.dataset.creator;

            const creator = btn.dataset.creator.trim();

            const initials = creator
                .split(/\s+/)
                .map(word => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

            document.getElementById("card-profile-avatar").textContent = initials;
            
            document.getElementById("card-details-title").textContent = `${btn.dataset.icon} ` + btn.dataset.title;

            document.getElementById("card-details-difficulty").textContent = "Difficulty • " + btn.dataset.difficulty;

            document.getElementById("card-details-description").textContent = btn.dataset.description;

            document.getElementById("card-details-posted").textContent = "Posted " + btn.dataset.posted;

            cardDetailsCard.classList.add("show");
            document.body.classList.add("no-scroll");
        });

    });

    filter();
}

function filter(){
    const filterSearch = document.getElementById("idea-search");
    const filterCategory = document.querySelectorAll(".category-btn");
    const filterDifficulty = document.querySelectorAll('input[name="diff"]');
    const filterSort = document.querySelectorAll('input[name="sortby"]');

    const cardsContainer = document.querySelector(".content");

    if(!filterSearch || !cardsContainer) {
        return
    }

    const cards = Array.from(cardsContainer.querySelectorAll(".card"));

    let selectedCategory = "All";

    filterCategory.forEach(button => {
        button.addEventListener("click", () => {
            selectedCategory = button.dataset.category;

            filterCategory.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            filterCards();
            
        });
    });


    filterSearch.addEventListener("input", () => {
        filterCards();
    });

    filterDifficulty.forEach(radio => {

        radio.addEventListener("change", () => {
            filterCards();
        });

    });

    filterSort.forEach(radio => {

        radio.addEventListener("change", () => {
            filterCards();
        })
    })

    function filterCards(){
        const searchValue = filterSearch.value.trim().toLowerCase();

        const selectedDifficulty = document.querySelector('input[name="diff"]:checked')?.value || "All";
        const selectedSort = document.querySelector('input[name="sortby"]:checked')?.value || "Newest";

        cards.forEach(card => {
            const title = card.dataset.title || "";
            const description = card.dataset.description || "";
            const category = card.dataset.category || "";
            const difficulty = card.dataset.difficulty || "";
            const creator = card.dataset.creator || "";

            const matchSearch = title.toLowerCase().includes(searchValue) || description.toLowerCase().includes(searchValue) || creator.toLowerCase().includes(searchValue);
            const matchCategory = selectedCategory === "All" || category === selectedCategory;
            const matchDifficulty = selectedDifficulty === "All" || difficulty === selectedDifficulty;

            const matches = matchSearch && matchCategory && matchDifficulty;

            card.classList.toggle("hidden", !matches);

        });

        if (selectedSort === "Newest") {
            cards.sort((a, b) => {
                return Number(b.dataset.date) - Number(a.dataset.date);
            });
        } else if (selectedSort === "Oldest") {
            cards.sort((a, b) => {
                return Number(a.dataset.date) - Number(b.dataset.date);
            });
        }

        cards.forEach(card => {
            cardsContainer.appendChild(card);
        });
        
    }

    filterCards();

}

initExplore();