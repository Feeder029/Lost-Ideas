const statLinks = document.querySelectorAll(".profile-stats-row");
const ideasContainer = document.querySelector(".ideas-container");
const ideasContent = document.querySelector(".ideas-content");
const ideasHeading = document.querySelector("#ideas-heading");

let previousScrollPosition = 0;

statLinks.forEach(link => {

    link.addEventListener("click", async event => {

        event.preventDefault();

        previousScrollPosition = window.scrollY;

        try {

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

                    details.append(title, posted);

                    ideaElement.append(
                        category,
                        details,
                        difficulty,
                        actions
                    );

                    ideasContent.appendChild(ideaElement);
                });
            }

            ideasContainer.classList.add("show");

            setTimeout(() => {
                window.scrollBy({
                    top: 180,
                    behavior: "smooth"
                });
            }, 150);
        } catch (error) {
            console.error("Failed to load ideas:", error);
        }
    });
});