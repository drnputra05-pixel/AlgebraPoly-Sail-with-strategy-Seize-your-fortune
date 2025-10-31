window.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    setTimeout(() => {
        header.classList.add("show");
    }, 200);

    const urlParams = new URLSearchParams(window.location.search);
    const soalId = urlParams.get("id"); 
    const semuaSoal = document.querySelectorAll("section");

    function handleDisplay() {
        const semuaGrup = document.querySelectorAll(".soal-group");

        semuaGrup.forEach(grup => {
            const sections = grup.querySelectorAll("section");
            let adaYangDitampilkan = false;

            sections.forEach(section => {
                const soalText = section.querySelector(".soal-text");
                const penjelasan = section.querySelector(".penjelasan");

                if (soalId && section.id.toLowerCase() === soalId.toLowerCase()) {
                    if (soalText) soalText.style.display = "none";
                    if (penjelasan) {
                        penjelasan.style.display = "block";
                        setupPenjelasanToggle(penjelasan, true);
                    }
                    section.style.display = "block";
                    adaYangDitampilkan = true;
                } else if (!soalId) {
                    if (soalText) soalText.style.display = "block";
                    if (penjelasan) {
                        penjelasan.style.display = "block";
                        setupPenjelasanToggle(penjelasan, false);
                    }
                    section.style.display = "block";
                    adaYangDitampilkan = true;
                } else {
                    section.style.display = "none";
                }
            });
            
            grup.style.display = adaYangDitampilkan ? "block" : "none";
        });
    }

    function setupPenjelasanToggle(penjelasanEl, autoExpand = false) {
        const judul = penjelasanEl.querySelector("h3");
        const contentElements = Array.from(penjelasanEl.children).filter(child => child !== judul);

        let contentWrapper = penjelasanEl.querySelector('.penjelasan-content');
        if (!contentWrapper) {
            contentWrapper = document.createElement('div');
            contentWrapper.className = 'penjelasan-content';
            contentElements.forEach(el => contentWrapper.appendChild(el));
            penjelasanEl.appendChild(contentWrapper);
        }

        let toggleBtn = penjelasanEl.querySelector('.toggle-penjelasan');
        if (!toggleBtn) {
            toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-penjelasan';
            toggleBtn.textContent = 'Tampilkan Penjelasan';
            penjelasanEl.insertBefore(toggleBtn, contentWrapper);
        }

        if (autoExpand) {
            contentWrapper.style.display = 'block';
            toggleBtn.textContent = 'Sembunyikan Penjelasan';
            judul.innerHTML = '📖 Penjelasan';
        } else {
            contentWrapper.style.display = 'none';
            toggleBtn.textContent = 'Tampilkan Penjelasan';
            judul.innerHTML = '📚 Penjelasan';
        }

        toggleBtn.addEventListener('click', () => {
            const isHidden = contentWrapper.style.display === 'none';
            contentWrapper.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? 'Sembunyikan Penjelasan' : 'Tampilkan Penjelasan';
            judul.innerHTML = isHidden ? '📖 Penjelasan' : '📚 Penjelasan';
            
            if (isHidden && window.MathJax) {
                MathJax.typesetPromise([contentWrapper]);
            }
        });
    }

    if (window.MathJax && MathJax.startup) {
        MathJax.startup.promise.then(handleDisplay).catch(err => {
            console.log('MathJax error:', err);
            handleDisplay(); 
        });
    } else {
        setTimeout(handleDisplay, 1000);
    }
});