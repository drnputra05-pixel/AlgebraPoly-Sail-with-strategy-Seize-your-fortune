window.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    if (header) {
        setTimeout(() => header.classList.add("show"), 200);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const soalId = urlParams.get("id");
    const semuaSection = document.querySelectorAll("section");

    function handleDisplay() {
        semuaSection.forEach(sec => sec.style.display = "block");

        if (soalId) {
            semuaSection.forEach(sec => sec.style.display = "none");
            const target = document.getElementById(soalId);
            if (target) target.style.display = "block";
        }

        document.querySelectorAll(".penjelasan").forEach(penjelasan => {
            setupPenjelasanToggle(penjelasan);
        });
    }

    function setupPenjelasanToggle(penjelasanEl) {
        const judul = penjelasanEl.querySelector("h3");
        if (!judul) return;

        let content = penjelasanEl.querySelector(".penjelasan-content");

        if (!content) {
            content = document.createElement("div");
            content.className = "penjelasan-content";

            [...penjelasanEl.children].forEach(child => {
                if (child !== judul) content.appendChild(child);
            });

            penjelasanEl.appendChild(content);
        }

        content.style.display = "none";
        penjelasanEl.classList.remove("open");

        judul.textContent = "📚 Penjelasan";
        judul.style.cursor = "pointer";

        judul.onclick = () => {
            const isOpen = penjelasanEl.classList.contains("open");

            penjelasanEl.classList.toggle("open", !isOpen);
            content.style.display = isOpen ? "none" : "block";
            judul.textContent = isOpen ? "📚 Penjelasan" : "📖 Penjelasan";

            if (!isOpen && window.MathJax) {
                MathJax.typesetPromise([content]).catch(() => {});
            }
        };
    }

    if (window.MathJax?.startup) {
        MathJax.startup.promise.then(handleDisplay);
    } else {
        handleDisplay();
    }
});
