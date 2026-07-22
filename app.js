async function loadComponent(file, targetId) {
    try {
        const response = await fetch(file);

        if (!response.ok) throw new Error(`${file} not found`);

        const html = await response.text();
        document.getElementById(targetId).innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}

async function loadPage(page) {
    try {
        const response = await fetch(page);

        if (!response.ok) throw new Error("Page not found");

        const html = await response.text();
        document.getElementById("content").innerHTML = html;

        // Initialize page-specific JS
        switch (page) {
            case "/public/pages/explore.html":
                if (typeof initExplore === "function") initExplore();
                break;

            case "/public/pages/main.html":
                if (typeof initHome === "function") initHome();
                break;
        }

    } catch (error) {
        document.getElementById("content").innerHTML = `
            <h2>404</h2>
            <p>Could not load the page.</p>
        `;
        console.error(error);
    }
}

async function initApp() {
    // Load nav and footer at the same time
    await Promise.all([
        loadComponent("/public/components/navbar/navbar.html", "nav"),
       
    ]);

    // Default page
    await loadPage("/public/pages/explore.html");
}

initApp();