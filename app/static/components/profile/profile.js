const statLinks = document.querySelectorAll(".profile-stats-row");
const ideasContainer = document.querySelector(".ideas-container");
const ideasContent = document.querySelector(".ideas-content");
const ideasHeading = document.querySelector("#ideas-heading");

let previousScrollPosition = 0;
let activeLink = null;

const cardTitle = document.querySelector("#card-details-title");
const cardCategory = document.querySelector("#card-details-category");

async function loadStats() {

    const response = await fetch("/new_stats");

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const stats = await response.json();

    document.querySelector("#ideas-shared").textContent = stats.ideas_shared;
    document.querySelector("#ideas-adopted").textContent = stats.ideas_adopted;
    document.querySelector("#ideas-built").textContent = stats.ideas_built;
}

async function loadIdeas(link, isOpening = false) {

    const response = await fetch(link.href);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const ideas = await response.json();

    ideasHeading.textContent = link.dataset.title;

    ideasContent.replaceChildren();

    if (ideas.length === 0) {

        const empty = document.createElement("p");
        empty.className = "no-ideas";
        empty.textContent = "No ideas found.";

        ideasContent.appendChild(empty);

    } else {

        ideas.forEach(idea => {

            const ideaElement = document.createElement("div");
            ideaElement.className = "idea";
            ideaElement.dataset.id = idea.id;

            const category = document.createElement("span");
            category.className = "idea-category";
            category.textContent = "💡";

            const details = document.createElement("div");
            details.className = "idea-details";

            const title = document.createElement("h2");
            title.className = "idea-title";
            title.textContent = idea.title;

            const posted = document.createElement("p");
            posted.className = "idea-posted";
            posted.textContent = `Posted ${idea.date_created}`;

            const difficulty = document.createElement("span");
            difficulty.className = "idea-difficulty";
            difficulty.textContent = idea.difficulty;

            const actions = document.createElement("a");
            actions.className = "actions";
            actions.href = "#";
            actions.textContent = "...";

            const actionsWrapper = document.createElement("div");
            actionsWrapper.className = "actions-wrapper";

            const actionsContainer = document.createElement("div");
            actionsContainer.className = "actions-container";

            const viewBtn = document.createElement("a");
            viewBtn.className = "btn-view";
            viewBtn.href = "#";
            viewBtn.textContent = "👁️ View";
            viewBtn.dataset.id = idea.id;
            viewBtn.dataset.title = idea.title;
            viewBtn.dataset.description = idea.description;
            viewBtn.dataset.difficulty = idea.difficulty;
            viewBtn.dataset.icon = idea.icon;
            viewBtn.dataset.category = idea.category;
            viewBtn.dataset.date = idea.date;
            viewBtn.dataset.anonymous = idea.anonymous;
            viewBtn.dataset.creator = idea.creator ?? "Anonymous";

            const editBtn = document.createElement("a");
            editBtn.className = "btn-edit";
            editBtn.href = "#";
            editBtn.textContent = "✏️ Edit";
            editBtn.dataset.id = idea.id;
            editBtn.dataset.title = idea.title;
            editBtn.dataset.description = idea.description;
            editBtn.dataset.difficulty = idea.difficulty;
            editBtn.dataset.category = idea.category;
            editBtn.dataset.anonymous = idea.anonymous;
            editBtn.dataset.creator = idea.creator ?? "Anonymous";

            const deleteBtn = document.createElement("a");
            deleteBtn.className = "btn-delete";
            deleteBtn.href = "#";
            deleteBtn.textContent = "🗑️ Delete";

            actionsContainer.append(viewBtn, editBtn, deleteBtn);

            details.append(title, posted);

            actionsWrapper.append(
                actions,
                actionsContainer
            );

            ideaElement.append(
                category,
                details,
                difficulty,
                actionsWrapper
            );

            ideasContent.appendChild(ideaElement);
        });
    }

    ideasContainer.classList.add("show");

    if (isOpening) {
        setTimeout(() => {
            window.scrollBy({
                top: 280,
                behavior: "smooth"
            });
        }, 150);
    }
}

statLinks.forEach(link => {

    link.addEventListener("click", async event => {

        event.preventDefault();

        if (
            ideasContainer.classList.contains("show") &&
            activeLink === link
        ) {
            ideasContainer.classList.remove("show");

            window.scrollTo({
                top: previousScrollPosition,
                behavior: "smooth"
            });

            activeLink = null;
            return;
        }

        const isOpening = !ideasContainer.classList.contains("show");

        if (isOpening) {
            previousScrollPosition = window.scrollY;
        }

        activeLink = link;

        try {
            await loadIdeas(link, isOpening);
        } catch (error) {
            console.error("Failed to load ideas:", error);
        }
    });

});

ideasContent.addEventListener("click", async event => {

    const actionsBtn = event.target.closest(".actions");

    if (actionsBtn) {

        event.preventDefault();
        event.stopPropagation();

        const idea = actionsBtn.closest(".idea");
        const clickedMenu = idea.querySelector(".actions-container");

        ideasContent.querySelectorAll(".actions-container.show").forEach(menu => {
            if (menu !== clickedMenu) {
                menu.classList.remove("show");
            }
        });

        clickedMenu.classList.toggle("show");
        return;
    }

    const deleteBtn = event.target.closest(".btn-delete");
    const editBtn = event.target.closest(".btn-edit");
    const viewBtn = event.target.closest(".btn-view");

    if (deleteBtn) {

        event.preventDefault();

        const idea = deleteBtn.closest(".idea");
        const ideaId = idea.dataset.id;

        if (!confirm("Delete this idea?")) {
            return;
        }

        try {
            const response = await fetch(`/delete/${ideaId}`, {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const tasks = [loadStats()];

            if (activeLink) {
                tasks.push(loadIdeas(activeLink));
            }

            await Promise.all(tasks);

        } catch (error) {
            console.error(error);
            alert("Failed to delete idea.");
        }

        return;
    } else if (editBtn) {

        document.querySelector('[name="form-title"]').value = editBtn.dataset.title;
        document.querySelector('[name="form-description"]').value = editBtn.dataset.description;
        document.querySelector('[name="form-category"]').value = editBtn.dataset.category;

        const difficultyRadio = document.querySelector(
            `[name="form-difficulty"][value="${editBtn.dataset.difficulty}"]`
        );
        if (difficultyRadio) difficultyRadio.checked = true;

        document.getElementById("form-anonymous").checked = editBtn.dataset.anonymous === "true";

        document.getElementById("idea-form-container").classList.add("show");
        document.body.classList.add("no-scroll");

        document.querySelector(".idea-form").dataset.editingId = editBtn.dataset.id;

        return;
    } else if (viewBtn) {

        cardCategory.textContent = viewBtn.dataset.icon;

        cardTitle.appendChild(cardCategory);
        cardTitle.append(document.createTextNode(viewBtn.dataset.title));

        document.querySelector("#card-details-description").textContent = viewBtn.dataset.description;
        document.querySelector("#card-details-difficulty").textContent ="Difficulty • " + viewBtn.dataset.difficulty;
        document.querySelector("#card-details-posted").textContent = "Posted " + viewBtn.dataset.date;
        document.querySelector("#card-profile-name").textContent = viewBtn.dataset.anonymous === "true" ? "Anonymous" : viewBtn.dataset.creator;
        document.querySelector("#card-profile-avatar").textContent = viewBtn.dataset.anonymous === "true" ? "A" : viewBtn.dataset.creator.split(" ").map(word => word[0]).join("").slice(0, 2).toUpperCase();

        document.getElementById("card-details-container").classList.add("show");
        document.body.classList.add("no-scroll");
    }
    
});

document.addEventListener("click", event => {

    if (event.target.closest(".ideas-content")) {
        return;
    }

    ideasContent.querySelectorAll(".actions-container.show").forEach(menu => {
        menu.classList.remove("show");
    });

});

const ideaFormContainer = document.getElementById("idea-form-container");
const btnIdeaClose = document.getElementById("btn-idea-close");
const cardDetailsCard = document.getElementById("card-details-container");
const btnCardClose = document.getElementById("btn-card-details-close");

function closeIdeaForm() {
    ideaFormContainer.classList.remove("show");
    document.body.classList.remove("no-scroll");
    document.querySelector(".idea-form").reset();
    delete document.querySelector(".idea-form").dataset.editingId;
}

function closeCardDetails() {
    cardDetailsCard.classList.remove("show");
    document.body.classList.remove("no-scroll");
    cardTitle.textContent = "";
    cardCategory.textContent = "";
    document.querySelector(".card-details-form").reset();
}

btnIdeaClose.addEventListener("click", closeIdeaForm);
btnCardClose.addEventListener("click", closeCardDetails);

ideaFormContainer.addEventListener("click", event => {
    if (event.target === ideaFormContainer) {
        closeIdeaForm();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && ideaFormContainer.classList.contains("show")) {
        closeIdeaForm();
    }
});

cardDetailsCard.addEventListener("click", event => {
    if (event.target === cardDetailsCard) {
        closeCardDetails();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && cardDetailsCard.classList.contains("show")) {
        closeCardDetails();
    }
});