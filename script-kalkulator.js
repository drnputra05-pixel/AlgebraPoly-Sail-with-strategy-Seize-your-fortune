window.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  setTimeout(() => {
    header.classList.add("show");
  }, 200);
});

const jumlahVariabelSelect = document.getElementById("JumlahVariabel");
const metodeSelect = document.getElementById("Metode");
const generateButton = document.getElementById("generateinput");
const form = document.getElementById("persamaanForm");
const hitungButton = document.getElementById("hitungbutton");
const hasilDiv = document.getElementById("hasil");
const langkahDiv = document.getElementById("langkahpenyelesaian");

generateButton.addEventListener("click", () => {
    const n = parseInt(jumlahVariabelSelect.value);
    form.innerHTML = "";
    
    if (!n) {
        alert("Pilih jumlah variabel dulu!");
        return;
    }

    let varNames = [];
    if (n === 2) varNames = ["x", "y"];
    else if (n === 3) varNames = ["x", "y", "z"];
    else if (n >= 4) varNames = ["x₁", "x₂", "x₃", "x₄"].slice(0, n);

    for (let i = 0; i < n; i++) {
        const div = document.createElement("div");
        div.className = "input-group";
        
        const label = document.createElement("label");
        label.textContent = `Persamaan ${i + 1}: `;
        label.htmlFor = `eq${i}`;
        
        const input = document.createElement("input");
        input.type = "text";
        input.id = `eq${i}`;
        input.placeholder = generateExampleEquation(varNames);
        input.className = "persamaan-input";
        
        div.appendChild(label);
        div.appendChild(input);
        form.appendChild(div);
    }
    
    hitungButton.classList.remove("hidden");
});

function generateExampleEquation(varNames) {
    let equation = "";
    for (let i = 0; i < varNames.length; i++) {

        const coef = (Math.random() * 4 + 1).toFixed(1);
        equation += `${coef}${varNames[i]}`;
        if (i < varNames.length - 1) equation += " + ";
    }
    const constant = (Math.random() * 8 + 2).toFixed(1);
    return `Contoh: ${equation} = ${constant}`;
}

hitungButton.addEventListener("click", () => {
    const n = parseInt(jumlahVariabelSelect.value);
    const metode = metodeSelect.value;
    const persamaanList = [];

    for (let i = 0; i < n; i++) {
        const input = document.getElementById(`eq${i}`);
        if (input && input.value.trim()) {
            persamaanList.push(input.value.trim());
        } else {
            alert(`Persamaan ${i + 1} belum diisi!`);
            return;
        }
    }

    if (!metode) {
        alert("Pilih metode penyelesaian dulu!");
        return;
    }

     try {
        const varNames = n === 2 ? ['x', 'y'] : n === 3 ? ['x', 'y', 'z'] : ['x₁', 'x₂', 'x₃', 'x₄'].slice(0, n);
        
        for (let i = 0; i < persamaanList.length; i++) {
            try {
                const { coefficients, constant } = parseEquation(persamaanList[i], varNames);
                console.log(`📝 Persamaan ${i+1}: "${persamaanList[i]}"`);
                console.log(`🔢 Koefisien: [${coefficients.join(', ')}]`);
                console.log(`📊 Konstanta: ${constant}`);
                console.log('---');
            } catch (error) {
                console.log(`❌ Error parsing persamaan ${i+1}: ${error.message}`);
            }
        }
        console.log("=== DEBUG END ===");

        const result = solveEquations(persamaanList, metode, n);
        displayResults(result, metode);
        
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
    try {
        const result = solveEquations(persamaanList, metode, n);
        displayResults(result, metode);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});


function parseEquation(equation, varNames) {
    const originalEquation = equation;
    
    equation = equation.replace(/\s+/g, '').toLowerCase();

    const sides = equation.split('=');
    if (sides.length !== 2) {
        throw new Error("Gunakan format: ax + by = c");
    }
    
    const leftSide = sides[0];
    const constant = parseFloat(sides[1]);
    
    if (isNaN(constant)) {
        throw new Error("Konstanta harus berupa angka");
    }
    
    const coefficients = new Array(varNames.length).fill(0);

    let current = '';
    let sign = 1;
    
    for (let i = 0; i <= leftSide.length; i++) {
        const char = leftSide[i] || '+';
        
        if (char === '+' || char === '-' || i === leftSide.length) {
            if (current) {
                let isVariable = false;
                for (let j = 0; j < varNames.length; j++) {
                    if (current.endsWith(varNames[j])) {
                        const coefStr = current.slice(0, -varNames[j].length);
                        let coefficient = 1;
                        
                        if (coefStr === '' || coefStr === '+') {
                            coefficient = 1;
                        } else if (coefStr === '-') {
                            coefficient = -1;
                        } else {
                            coefficient = parseFloat(coefStr);
                            if (isNaN(coefficient)) {
                                throw new Error(`Koefisien '${coefStr}' tidak valid`);
                            }
                        }
                        
                        coefficients[j] += sign * coefficient;
                        isVariable = true;
                        break;
                    }
                }

                if (!isVariable && current !== '+' && current !== '-') {
                    const num = parseFloat(current);
                    if (!isNaN(num)) {
                    }
                }
            }
            
            current = '';
            sign = (char === '-') ? -1 : 1;
        } else {
            current += char;
        }
    }
    
    return { coefficients, constant, originalEquation };
}

function formatNumber(num) {
    return parseFloat(num.toFixed(4)).toString();
}
function solveEquations(persamaanList, metode, n) {
    const matrixA = [];
    const matrixB = [];
    const originalEquations = [];
    const varNames = n === 2 ? ['x', 'y'] : 
                    n === 3 ? ['x', 'y', 'z'] : 
                    ['x₁', 'x₂', 'x₃', 'x₄'].slice(0, n);
    
    for (let i = 0; i < persamaanList.length; i++) {
        const { coefficients, constant, originalEquation } = parseEquation(persamaanList[i], varNames);
        matrixA.push(coefficients);
        matrixB.push(constant);
        originalEquations.push(originalEquation);
    }
    
    let solution;
    let steps = [];

    steps.push(`<div class="step-section"><strong>📝 SISTEM PERSAMAAN AWAL:</strong></div>`);
    for (let i = 0; i < n; i++) {
        steps.push(`<div class="equation">Persamaan (${i + 1}): ${originalEquations[i]}</div>`);
    }

    switch (metode) {
        case "Eliminasi":
            solution = solveEliminasi(matrixA, matrixB, n, varNames, steps);
            break;
        case "Subtitusi":
            solution = solveSubtitusi(matrixA, matrixB, n, varNames, steps);
            break;
        case "Campuran":
            solution = solveCampuran(matrixA, matrixB, n, varNames, steps);
            break;
        case "OBE":
            solution = solveOBE(matrixA, matrixB, n, varNames, steps);
            break;
        default:
            throw new Error("Metode tidak dikenali");
    }
    
    return { solution, steps };
}

function solveSubtitusi(A, B, n, varNames, steps) {
    steps.push(`<div class="step-section"><strong>🔧 METODE SUBTITUSI:</strong></div>`);
    

    if (n === 2) {
        return solveSubtitusi2Var(A, B, varNames, steps);
    } else {
        return solveSubtitusiGeneral(A, B, n, varNames, steps);
    }
}

function solveSubtitusi2Var(A, B, varNames, steps) {
    const solution = new Array(2);
    
    steps.push(`<div class="step"><strong>Langkah 1: Ekspresikan satu variabel</strong></div>`);

    const a1 = A[0][0], b1 = A[0][1], c1 = B[0];
    const a2 = A[1][0], b2 = A[1][1], c2 = B[1];
    
    steps.push(`<div class="substep">Dari Persamaan 2: ${a2}${varNames[0]} + ${b2}${varNames[1]} = ${c2}</div>`);

    const expr = `${varNames[0]} = (${c2} - ${b2}${varNames[1]}) / ${a2}`;
    steps.push(`<div class="equation">${expr}</div>`);
    
    const simplifiedExpr = `${varNames[0]} = ${c2/a2} - ${b2/a2}${varNames[1]}`;
    steps.push(`<div class="substep">Setelah disederhanakan: <strong>${simplifiedExpr}</strong></div>`);
    
    steps.push(`<div class="step"><strong>Langkah 2: Substitusi ke persamaan lain</strong></div>`);
    
    steps.push(`<div class="substep">Substitusi ke Persamaan 1: ${a1}${varNames[0]} + ${b1}${varNames[1]} = ${c1}</div>`);
    
    const substExpr = `${a1}(${c2/a2} - ${b2/a2}${varNames[1]}) + ${b1}${varNames[1]} = ${c1}`;
    steps.push(`<div class="equation">${substExpr}</div>`);

    const term1 = a1 * (c2 / a2);
    const yCoeff = -a1 * (b2 / a2) + b1;
    
    steps.push(`<div class="substep">${term1} + ${yCoeff}${varNames[1]} = ${c1}</div>`);

    solution[1] = (c1 - term1) / yCoeff;
    steps.push(`<div class="substep">${varNames[1]} = (${c1} - ${term1}) / ${yCoeff}</div>`);
    steps.push(`<div class="substep"><strong>${varNames[1]} = ${formatNumber(solution[1])}</strong></div>`);
    
    steps.push(`<div class="step"><strong>Langkah 3: Cari variabel pertama</strong></div>`);
    
    solution[0] = (c2 - b2 * solution[1]) / a2;
    steps.push(`<div class="substep">Gunakan: ${varNames[0]} = (${c2} - ${b2} × ${formatNumber(solution[1])}) / ${a2}</div>`);
    steps.push(`<div class="substep"><strong>${varNames[0]} = ${formatNumber(solution[0])}</strong></div>`);
    
    return solution;
}

function solveSubtitusiGeneral(A, B, n, varNames, steps) {
    steps.push(`<div class="substep">Untuk ${n} variabel, menggunakan eliminasi Gaussian...</div>`);
    return solveEliminasi(A, B, n, varNames, steps);
}

function solveEliminasi(A, B, n, varNames, steps) {
    steps.push(`<div class="step-section"><strong>🔧 METODE ELIMINASI:</strong></div>`);

    const currentA = A.map(row => [...row]);
    const currentB = [...B];

    steps.push(`<div class="step"><strong>Langkah 1: Eliminasi variabel secara berurutan</strong></div>`);

    for (let i = 0; i < n - 1; i++) {
        for (let k = i + 1; k < n; k++) {
            if (currentA[k][i] !== 0) {
                const factor = currentA[k][i] / currentA[i][i];
                steps.push(`<div class="substep">Eliminasi variabel ${varNames[i]} dari Persamaan (${k + 1}) dengan menggunakan Persamaan (${i + 1})</div>`);
                steps.push(`<div class="substep">Faktor: (${formatNumber(currentA[k][i])}) / (${formatNumber(currentA[i][i])}) = ${formatNumber(factor)}</div>`);

                for (let j = i; j < n; j++) {
                    const oldValue = currentA[k][j];
                    currentA[k][j] -= factor * currentA[i][j];
                    steps.push(`<div class="substep">${varNames[j]}: ${formatNumber(oldValue)} - (${formatNumber(factor)} × ${formatNumber(currentA[i][j])}) = ${formatNumber(currentA[k][j])}</div>`);
                }

                const oldB = currentB[k];
                currentB[k] -= factor * currentB[i];
                steps.push(`<div class="substep">Konstanta: ${formatNumber(oldB)} - (${formatNumber(factor)} × ${formatNumber(currentB[i])}) = ${formatNumber(currentB[k])}</div>`);

                // tampilkan persamaan baru
                let newEq = `Persamaan (${k + 1}) baru: `;
                for (let j = 0; j < n; j++) {
                    if (currentA[k][j] !== 0) {
                        if (newEq !== `Persamaan (${k + 1}) baru: `) newEq += " + ";
                        newEq += `${formatNumber(currentA[k][j])}${varNames[j]}`;
                    }
                }
                newEq += ` = ${formatNumber(currentB[k])}`;
                steps.push(`<div class="equation">${newEq}</div>`);
            }
        }
    }

    steps.push(`<div class="step"><strong>Langkah 2: Eliminasi antar persamaan sisa</strong></div>`);

    // Jika 2 variabel → langsung selesaikan dua persamaan terakhir
    let solution = new Array(n).fill(0);
    if (n === 2) {
        const [a1, b1] = currentA[0];
        const [a2, b2] = currentA[1];
        const c1 = currentB[0];
        const c2 = currentB[1];

        const det = a1 * b2 - a2 * b1;
        if (det === 0) throw new Error("Sistem tidak memiliki solusi unik.");

        const x = (c1 * b2 - c2 * b1) / det;
        const y = (a1 * c2 - a2 * c1) / det;

        solution[0] = x;
        solution[1] = y;

        steps.push(`<div class="equation"><strong>Dari hasil eliminasi:</strong></div>`);
        steps.push(`<div class="equation">Determinannya: (${formatNumber(a1)}×${formatNumber(b2)}) - (${formatNumber(a2)}×${formatNumber(b1)}) = ${formatNumber(det)}</div>`);
        steps.push(`<div class="equation">${varNames[0]} = (${formatNumber(c1)}×${formatNumber(b2)} - ${formatNumber(c2)}×${formatNumber(b1)}) / ${formatNumber(det)} = ${formatNumber(x)}</div>`);
        steps.push(`<div class="equation">${varNames[1]} = (${formatNumber(a1)}×${formatNumber(c2)} - ${formatNumber(a2)}×${formatNumber(c1)}) / ${formatNumber(det)} = ${formatNumber(y)}</div>`);
    } 
    else if (n === 3) {
        const det = 
            currentA[0][0]*(currentA[1][1]*currentA[2][2] - currentA[1][2]*currentA[2][1]) -
            currentA[0][1]*(currentA[1][0]*currentA[2][2] - currentA[1][2]*currentA[2][0]) +
            currentA[0][2]*(currentA[1][0]*currentA[2][1] - currentA[1][1]*currentA[2][0]);

        if (det === 0) throw new Error("Sistem tidak memiliki solusi unik.");

        const detX =
            currentB[0]*(currentA[1][1]*currentA[2][2] - currentA[1][2]*currentA[2][1]) -
            currentA[0][1]*(currentB[1]*currentA[2][2] - currentA[1][2]*currentB[2]) +
            currentA[0][2]*(currentB[1]*currentA[2][1] - currentA[1][1]*currentB[2]);

        const detY =
            currentA[0][0]*(currentB[1]*currentA[2][2] - currentA[1][2]*currentB[2]) -
            currentB[0]*(currentA[1][0]*currentA[2][2] - currentA[1][2]*currentA[2][0]) +
            currentA[0][2]*(currentA[1][0]*currentB[2] - currentB[1]*currentA[2][0]);

        const detZ =
            currentA[0][0]*(currentA[1][1]*currentB[2] - currentB[1]*currentA[2][1]) -
            currentA[0][1]*(currentA[1][0]*currentB[2] - currentB[1]*currentA[2][0]) +
            currentB[0]*(currentA[1][0]*currentA[2][1] - currentA[1][1]*currentA[2][0]);

        const x = detX / det;
        const y = detY / det;
        const z = detZ / det;

        solution = [x, y, z];

        steps.push(`<div class="equation"><strong>Dari hasil eliminasi (aturan Cramer):</strong></div>`);
        steps.push(`<div class="equation">Det(A) = ${formatNumber(det)}</div>`);
        steps.push(`<div class="equation">${varNames[0]} = Det(X) / Det(A) = ${formatNumber(detX)} / ${formatNumber(det)} = ${formatNumber(x)}</div>`);
        steps.push(`<div class="equation">${varNames[1]} = Det(Y) / Det(A) = ${formatNumber(detY)} / ${formatNumber(det)} = ${formatNumber(y)}</div>`);
        steps.push(`<div class="equation">${varNames[2]} = Det(Z) / Det(A) = ${formatNumber(detZ)} / ${formatNumber(det)} = ${formatNumber(z)}</div>`);
    } 
    else {
        throw new Error("Metode eliminasi ini baru mendukung 2 atau 3 variabel saja untuk saat ini.");
    }

    return solution;
}


function solveCampuran(A, B, n, varNames, steps) {
    steps.push(`<div class="step-section"><strong>🔧 METODE CAMPURAN (ELIMINASI-SUBTITUSI):</strong></div>`);
    
    steps.push(`<div class="step">Metode ini menggabungkan eliminasi Gauss untuk menyederhanakan sistem dan substitusi balik untuk menemukan solusi akhir.</div>`);
    

    return solveEliminasi(A, B, n, varNames, steps);
}

function solveOBE(A, B, n, varNames, steps) {
    steps.push(`<div class="step-section"><strong>🔧 METODE OBE (OPERASI BARIS ELEMENTER):</strong></div>`);
    
    steps.push(`<div class="step">Mengubah matriks augmented menjadi bentuk eselon baris melalui operasi baris elementer.</div>`);
    
    return solveEliminasi(A, B, n, varNames, steps);
}

// Display results
function displayResults(result, metode) {
    const { solution, steps } = result;
    
    let html = `<div class="step-section"><strong>🎉 HASIL SOLUSI:</strong></div>`;
    
    html += `<div class="solution-box">`;
    html += `<h3>Solusi Sistem Persamaan:</h3>`;
    
    for (let i = 0; i < solution.length; i++) {
        const varName = solution.length === 2 ? ['x', 'y'][i] : 
                       solution.length === 3 ? ['x', 'y', 'z'][i] : 
                       `x${i + 1}`;
        html += `<div class="solution-item">${varName} = ${formatNumber(solution[i])}</div>`;
    }
    html += `</div>`;
    
    html += `<div class="step-section"><strong>📖 LANGKAH-LANGKAH ${metode.toUpperCase()}:</strong></div>`;
    steps.forEach(step => {
        html += step;
    });
    
    langkahDiv.innerHTML = html;
    hasilDiv.classList.remove("hidden");
    
    // Scroll to results
    setTimeout(() => {
        hasilDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Font-face untuk PiratesScroll
const fontStyle = document.createElement('style');
fontStyle.textContent = `
    @font-face {
        font-family: "PiratesScroll";
        src: url("fonts/Pirate Scroll.otf") format("truetype");
    }
`;
document.head.appendChild(fontStyle);