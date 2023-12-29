function submitForm() {
    const form = document.getElementById('apiForm');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    const formData = {
        image_name: form.image_name.value,
        image_tag: form.image_tag.value,
        username: form.username.value,
        password: form.password.value,
        registry: form.registry.value,
        output_format: form.output_format.value,
        onlysbom: form.onlysbom.checked
    };

    loadingDiv.style.display = 'block';
    resultDiv.innerHTML = ''; // Clear previous results

    // Determine the fetch URL based on the 'onlysbom' checkbox
    const fetchUrl = formData.onlysbom
        ? 'http://sbomreport.nirmaysystems.com:5000/generate_sbom'  // Fetch from this URL if onlysbom is checked
        : 'http://sbomreport.nirmaysystems.com:5000/generate_vulnerability_report';  // Fetch from this URL if onlysbom is not checked

    fetch(fetchUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data:', data);
        loadingDiv.style.display = 'none';

        // Update the resultDiv based on whether onlysbom is true or false
        if (formData.onlysbom) {
            resultDiv.innerHTML = `
                <p><strong>SBOM URL:</strong> <a href="${data['SBOM URL']}" target="_blank">${data['SBOM URL']}</a></p>
            `;
        } else {
            resultDiv.innerHTML = `
                <p><strong>SBOM Report URL:</strong> <a href="${data['SBOM Report URL']}" target="_blank">${data['SBOM Report URL']}</a></p>
                <p><strong>Vulnerability Report URL:</strong> <a href="${data['Vulnerability Report URL']}" target="_blank">${data['Vulnerability Report URL']}</a></p>
            `;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        loadingDiv.style.display = 'none';
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}
