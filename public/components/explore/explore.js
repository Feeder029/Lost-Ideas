function initExplore() {
    const difficultyValue = document.getElementById("difficulty-value");
    const sortValue = document.getElementById("sort-value");

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
}