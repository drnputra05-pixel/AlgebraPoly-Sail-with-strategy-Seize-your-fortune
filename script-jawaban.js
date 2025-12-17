window.addEventListener("DOMContentLoaded", () => {

    // animasi header
    const header = document.querySelector(".Bagian-atas");
    if (header) {
        setTimeout(() => header.classList.add("show"), 200);
    }

    // mode QR (id soal)
    const soalId = new URLSearchParams(window.location.search).get("id");
    const sections = document.querySelectorAll("section");

    sections.forEach(sec => sec.style.display = "block");

    if (soalId) {
        sections.forEach(sec => sec.style.display = "none");
        const target = document.getElementById(soalId);
        if (target) target.style.display = "block";
    }

    // toggle penjelasan
    document.querySelectorAll(".penjelasan").forEach(penjelasan => {
        const judul = penjelasan.querySelector("h3");
        const content = penjelasan.querySelector(".penjelasan-content");

        if (!judul || !content) return;

        // default TERTUTUP
        penjelasan.classList.remove("open");
        content.style.display = "none";
        judul.textContent = "📚 Penjelasan";
        judul.style.cursor = "pointer";

        judul.addEventListener("click", () => {
            const buka = penjelasan.classList.toggle("open");

            content.style.display = buka ? "block" : "none";
            judul.textContent = buka ? "📖 Penjelasan" : "📚 Penjelasan";

            // MathJax hanya saat dibuka
            if (buka && window.MathJax) {
                MathJax.typesetPromise([content]).catch(() => {});
            }
        });
    });

});
