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
    submitIdeaForm();
}

function filter() {
    const filterSearch = document.getElementById("idea-search");
    const filterCategory = document.querySelectorAll(".category-btn");
    const filterDifficulty = document.querySelectorAll('input[name="diff"]');
    const filterSort = document.querySelectorAll('input[name="sortby"]');

    const cardsContainer = document.querySelector(".content");
    const pagination = document.getElementById("pagination");

    if (!filterSearch || !cardsContainer || !pagination) {
        return;
    }

    const cards = Array.from(cardsContainer.querySelectorAll(".card"));

    const cardsPerPage = 9;
    let currentPage = 1;

    let selectedCategory = "All";

    filterCategory.forEach(button => {
        button.addEventListener("click", () => {
            selectedCategory = button.dataset.category;

            filterCategory.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentPage = 1;
            filterCards();
        });
    });

    filterSearch.addEventListener("input", () => {
        currentPage = 1;
        filterCards();
    });

    filterDifficulty.forEach(radio => {
        radio.addEventListener("change", () => {
            currentPage = 1;
            filterCards();
        });
    });

    filterSort.forEach(radio => {
        radio.addEventListener("change", () => {
            currentPage = 1;
            filterCards();
        });
    });

    function filterCards() {

        const searchValue = filterSearch.value.trim().toLowerCase();

        const selectedDifficulty =
            document.querySelector('input[name="diff"]:checked')?.value || "All";

        const selectedSort =
            document.querySelector('input[name="sortby"]:checked')?.value || "Newest";


        // -------------------------
        // FILTER
        // -------------------------

        const filteredCards = cards.filter(card => {

            const title = card.dataset.title || "";
            const description = card.dataset.description || "";
            const category = card.dataset.category || "";
            const difficulty = card.dataset.difficulty || "";
            const creator = card.dataset.creator || "";

            const matchSearch =
                title.toLowerCase().includes(searchValue) ||
                description.toLowerCase().includes(searchValue) ||
                creator.toLowerCase().includes(searchValue);

            const matchCategory =
                selectedCategory === "All" ||
                category === selectedCategory;

            const matchDifficulty =
                selectedDifficulty === "All" ||
                difficulty === selectedDifficulty;

            return matchSearch &&
                   matchCategory &&
                   matchDifficulty;
        });


        // -------------------------
        // SORT
        // -------------------------

        if (selectedSort === "Newest") {

            filteredCards.sort((a, b) => {
                return Number(b.dataset.date) - Number(a.dataset.date);
            });

        } else if (selectedSort === "Oldest") {

            filteredCards.sort((a, b) => {
                return Number(a.dataset.date) - Number(b.dataset.date);
            });
        } else if (selectedSort === "Most Adopted")  {
            filteredCards.sort((a, b) => {
                return Number(b.dataset.adopted) - Number(a.dataset.adopted);
            });
        } else if (selectedSort === "Never Adopted") {
            filteredCards.sort((a, b) => {
                return Number(a.dataset.adopted) - Number(b.dataset.adopted);
            });
        }

        // -------------------------
        // PAGINATION
        // -------------------------

        const totalPages = Math.ceil(
            filteredCards.length / cardsPerPage
        );

        // Prevent invalid page
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }

        const start = (currentPage - 1) * cardsPerPage;
        const end = start + cardsPerPage;

        const pageCards = filteredCards.slice(start, end);


        // -------------------------
        // SHOW / HIDE CARDS
        // -------------------------

        cards.forEach(card => {
            card.classList.add("hidden");
        });

        pageCards.forEach(card => {

            card.classList.remove("hidden");

            cardsContainer.appendChild(card);
        });


        // -------------------------
        // PAGINATION BUTTONS
        // -------------------------

        renderPagination(totalPages);
    }


    function renderPagination(totalPages) {

        pagination.replaceChildren();

        if (totalPages <= 1) {
            return;
        }

        // Previous button
        const previousBtn = document.createElement("button");

        previousBtn.textContent = "←";
        previousBtn.className = "pagination-btn";

        previousBtn.disabled = currentPage === 1;

        previousBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                filterCards();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        });

        pagination.appendChild(previousBtn);


        // Page numbers
        for (let page = 1; page <= totalPages; page++) {

            const pageBtn = document.createElement("button");

            pageBtn.textContent = page;
            pageBtn.className = "pagination-btn";

            if (page === currentPage) {
                pageBtn.classList.add("active");
            }

            pageBtn.addEventListener("click", () => {

                currentPage = page;

                filterCards();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });

            pagination.appendChild(pageBtn);
        }


        // Next button
        const nextBtn = document.createElement("button");

        nextBtn.textContent = "→";
        nextBtn.className = "pagination-btn";

        nextBtn.disabled = currentPage === totalPages;

        nextBtn.addEventListener("click", () => {

            if (currentPage < totalPages) {
                currentPage++;
                filterCards();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        });

        pagination.appendChild(nextBtn);
    }


    // Initial filtering
    filterCards();
}

function submitIdeaForm() {

    const ideaForm = document.querySelector(".idea-form");
    const submitConfirmContainer = document.getElementById("submit-confirm-container");
    const btnSubmitYes = document.getElementById("btn-submit-yes");
    const btnSubmitNo = document.getElementById("btn-submit-no");

    if (
        !ideaForm ||
        !submitConfirmContainer ||
        !btnSubmitYes ||
        !btnSubmitNo
    ) {
        console.error("Submit confirmation elements not found.");
        return;
    }

    ideaForm.addEventListener("submit", event => {

        event.preventDefault();

        submitConfirmContainer.classList.add("show");
        document.body.classList.add("no-scroll");
    });

    btnSubmitNo.addEventListener("click", () => {

        submitConfirmContainer.classList.remove("show");
        document.body.classList.remove("no-scroll");

    });

    btnSubmitYes.addEventListener("click", () => {

        submitConfirmContainer.classList.remove("show");
        document.body.classList.remove("no-scroll");

        ideaForm.submit();

    });

    submitConfirmContainer.addEventListener("click", event => {

        if (event.target === submitConfirmContainer) {

            submitConfirmContainer.classList.remove("show");
            document.body.classList.remove("no-scroll");

        }

    });

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            submitConfirmContainer.classList.contains("show")
        ) {

            submitConfirmContainer.classList.remove("show");
            document.body.classList.remove("no-scroll");

        }

    });
}


initExplore();