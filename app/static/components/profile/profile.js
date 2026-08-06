const statLinks = document.querySelectorAll(".profile-stats-row");
const ideasContainer = document.querySelector(".ideas-container");
const ideasContent = document.querySelector(".ideas-content");
const ideasHeading = document.querySelector("#ideas-heading");

let previousScrollPosition = 0;
let activeLink = null;

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

            const view = document.createElement("a");
            view.className = "view";
            view.href = "#";
            view.textContent = "👁️ View";

            const edit = document.createElement("a");
            edit.className = "edit";
            edit.href = "#";
            edit.textContent = "✏️ Edit";

            const deleteBtn = document.createElement("a");
            deleteBtn.className = "delete";
            deleteBtn.href = "#";
            deleteBtn.textContent = "🗑️ Delete";

            actionsContainer.append(view, edit, deleteBtn);

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

    const deleteBtn = event.target.closest(".delete");

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