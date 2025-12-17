document.addEventListener("DOMContentLoaded", () => {

    const header = document.querySelector("header");
    if (header) {
        setTimeout(() => header.classList.add("show"), 200);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const soalId = urlParams.get("id");
    const semuaSection = document.querySelectorAll("section");

    semuaSection.forEach(sec => sec.style.display = "block");

    if (soalId) {
        semuaSection.forEach(sec => sec.style.display = "none");
        const target = document.getElementById(soalId);
        if (target) target.style.display = "block";
    }

    document.querySelectorAll(".penjelasan").forEach(penjelasan => {
        const judul = penjelasan.querySelector("h3");
        const content = penjelasan.querySelector(".penjelasan-content");

        if (!judul || !content) return;

        penjelasan.classList.remove("open");
        content.style.display = "none";
        judul.style.cursor = "pointer";

        judul.addEventListener("click", () => {
            const isOpen = penjelasan.classList.contains("open");

            if (isOpen) {
                penjelasan.classList.remove("open");
                content.style.display = "none";
                judul.textContent = "📚 Penjelasan";
            } else {
                penjelasan.classList.add("open");
                content.style.display = "block";
                judul.textContent = "📖 Penjelasan";

                if (window.MathJax) {
                    MathJax.typesetPromise([content]).catch(() => {});
                }
            }
        });
    });

});
