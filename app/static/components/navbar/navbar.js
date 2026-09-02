function initNavbar() {
    const logoutBtn = document.getElementById("btn-auth-logout");
    const logoutConfirmContainer = document.getElementById("logout-confirm-container");
    const btnLogoutYes = document.getElementById("btn-logout-yes");
    const btnLogoutNo = document.getElementById("btn-logout-no");

    logoutBtn.addEventListener("click", event => {
        event.preventDefault();

        logoutConfirmContainer.classList.add("show");
        document.body.classList.add("no-scroll");
    });

    btnLogoutNo.addEventListener("click", () => {
        logoutConfirmContainer.classList.remove("show");
        document.body.classList.remove("no-scroll");
    });

    btnLogoutYes.addEventListener("click", () => {
        window.location.href = logoutBtn.href;
    });

    logoutConfirmContainer.addEventListener("click", event => {
        if (event.target === logoutConfirmContainer) {
            logoutConfirmContainer.classList.remove("show");
            document.body.classList.remove("no-scroll");
        }
    });

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            logoutConfirmContainer.classList.contains("show")
        ) {
            logoutConfirmContainer.classList.remove("show");
            document.body.classList.remove("no-scroll");
        }
    });
}

initNavbar();