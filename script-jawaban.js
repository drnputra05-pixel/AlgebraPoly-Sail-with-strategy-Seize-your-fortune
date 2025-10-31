window.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    setTimeout(() => {
        header.classList.add("show");
    }, 200);

    const urlParams = new URLSearchParams(window.location.search);
    const soalId = urlParams.get("id"); 
    const semuaGrup = document.querySelectorAll(".soal-group");

    function handleDisplay() {
        console.log("Soal ID:", soalId);

        if (!soalId) {
            console.log("Mode: Tampilkan semua soal");
            semuaGrup.forEach(grup => {
                grup.style.display = "block";
                const sections = grup.querySelectorAll("section");
                sections.forEach(section => {
                    section.style.display = "block";
                    const soalText = section.querySelector(".soal-text");
                    const penjelasan = section.querySelector(".penjelasan");
                    if (soalText) soalText.style.display = "block";
                    if (penjelasan) {
                        penjelasan.style.display = "block";
                        setupPenjelasanToggle(penjelasan, false); // Penjelasan collapsed
                    }
                });
            });
            return;
        }

        console.log("Mode: Single soal - mencari:", soalId);
        
        semuaGrup.forEach(grup => {
            const sections = grup.querySelectorAll("section");
            let grupIniAktif = false;

            sections.forEach(section => {
                if (section.id.toLowerCase() === soalId.toLowerCase()) {
                    console.log("Found matching section:", section.id);
                    section.style.display = "block";
                    const soalText = section.querySelector(".soal-text");
                    const penjelasan = section.querySelector(".penjelasan");
                    
                    if (soalText) soalText.style.display = "none";
                    if (penjelasan) {
                        penjelasan.style.display = "block";
                        setupPenjelasanToggle(penjelasan, true);
                    }
                    grupIniAktif = true;
                } else {
                    section.style.display = "none";
                }
            });

            if (grupIniAktif) {
                console.log("Menampilkan grup:", grup.id);
                grup.style.display = "block";
            } else {
                console.log("Menyembunyikan grup:", grup.id);
                grup.style.display = "none";
            }
        });
    }

function setupPenjelasanToggle(penjelasanEl, autoExpand = false) {
    console.log("Setup penjelasan untuk:", penjelasanEl, "autoExpand:", autoExpand);
    
    const judul = penjelasanEl.querySelector("h3");
    
    let toggleBtn = penjelasanEl.querySelector('.toggle-penjelasan');
    let contentWrapper = penjelasanEl.querySelector('.penjelasan-content');
    
    if (!toggleBtn || !contentWrapper) {
        const children = Array.from(penjelasanEl.children);
        const contentElements = children.filter(child => child !== judul && !child.classList.contains('toggle-penjelasan'));
        
        contentWrapper = document.createElement('div');
        contentWrapper.className = 'penjelasan-content';
        
        contentElements.forEach(el => {
            contentWrapper.appendChild(el);
        });
        
        toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-penjelasan';
        toggleBtn.textContent = 'Tampilkan Penjelasan';
        
        penjelasanEl.appendChild(toggleBtn);
        penjelasanEl.appendChild(contentWrapper);
    }
    
    if (autoExpand) {
        contentWrapper.style.display = 'block';
        toggleBtn.textContent = 'Sembunyikan Penjelasan';
        if (judul) judul.innerHTML = '📖 Penjelasan';
    } else {
        contentWrapper.style.display = 'none';
        toggleBtn.textContent = 'Tampilkan Penjelasan';
        if (judul) judul.innerHTML = '📚 Penjelasan';
    }
    
    const newToggleBtn = toggleBtn.cloneNode(true);
    toggleBtn.replaceWith(newToggleBtn);
    
    newToggleBtn.addEventListener('click', () => {
        const isHidden = contentWrapper.style.display === 'none';
        contentWrapper.style.display = isHidden ? 'block' : 'none';
        newToggleBtn.textContent = isHidden ? 'Sembunyikan Penjelasan' : 'Tampilkan Penjelasan';
        if (judul) judul.innerHTML = isHidden ? '📖 Penjelasan' : '📚 Penjelasan';
        
        if (isHidden && window.MathJax) {
            setTimeout(() => {
                MathJax.typesetPromise([contentWrapper]).catch(err => {
                    console.log('MathJax typeset error:', err);
                });
            }, 100);
        }
    });
    
    console.log("Setup penjelasan selesai untuk:", penjelasanEl);
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