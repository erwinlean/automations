"use strict";

const search_values = document.getElementById("input_values");
const search_init = document.getElementById("init");
const download_data = document.getElementById("download");

const scrappe_init = async () => {
    const input = search_values.value.trim();
    
    let ids = input.split(/[\s,]+/).map(id => id.trim()).filter(id => id !== '');

    try {
        const response = await fetch("scraperurl", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productCodes: ids })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        const tableBody = document.getElementById('productsTableBody');
        tableBody.innerHTML = '';

        data.forEach(product => {
            const row = document.createElement('tr');
            row.classList.add('border-b', 'transition-colors', 'hover:bg-muted/50', 'data-[state=selected]:bg-muted');

            row.innerHTML = `
                <td class="h-12 px-4 text-left align-middle font-small text-muted-foreground">${product.id}</td>
                <td class="h-12 px-4 text-left align-middle font-small text-muted-foreground"><a href="${product.url}" target="_blank">${product.url}</a></td>
                <td class="h-12 px-4 text-left align-middle font-small text-muted-foreground">${product.titulo}</td>
                <td class="h-12 px-4 text-left align-middle font-small text-muted-foreground">${product.descripcion}</td>
                <td class="h-12 px-4 text-left align-middle font-small text-muted-foreground"><img src="${product.imagen_principal}" alt="${product.titulo}" style="width: 100px;"></td>
                <td class="h-12 px-4 text-left align-middle font-small text-muted-foreground">${product.imagenes_extras.split(', ').map(url => `<img src="${url}" alt="Extra Image" style="width: 50px;">`).join('')}</td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }
};

search_init.addEventListener("click", scrappe_init);
