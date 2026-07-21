async function loadPage (page) {
     try {
        const response = await fetch(page);

        if (!response.ok) {
            throw new Error("Page not found");
        }

        const html = await response.text();

        document.getElementById("content").innerHTML = html;
    } catch (error) {
        document.getElementById("content").innerHTML = `
            <h2>404</h2>
            <p>Could not load the page.</p>
        `;
        console.error(error);
    }
}

loadPage("/public/pages/explore.html");