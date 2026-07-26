function initNavbar() {
    
    const authForm = document.getElementById("auth-container");
    const authOpenBtn = document.getElementById("btn-auth-open");
    const authCloseBtn = document.getElementById("btn-auth-close");

    authOpenBtn.addEventListener("click", () => {
        authForm.classList.add("show");
        document.body.classList.add("no-scroll");
    });

    authCloseBtn.addEventListener("click", () => {
        authForm.classList.remove("show");
        document.body.classList.remove("no-scroll");
    });

    authForm.addEventListener("click", (e) => {
        if(e.target === authForm) {
            authForm.classList.remove("show");
            document.body.classList.remove("no-scroll");
        }
    });
}