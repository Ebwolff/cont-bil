// ========================================
// LOGICA COLABORAÇÃO / CO-CRIAÇÃO
// ========================================

document.getElementById('colabForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        if (data[key]) {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    });

    console.log('Contribuição de Co-criação capturada:', data);

    // Esconde formulário e mostra mensagem de agradecimento
    const form = document.querySelector('.survey-form');
    const thankYou = document.getElementById('thankYouMessage');

    form.classList.add('hidden');
    thankYou.classList.remove('hidden');

    // Scroll para o topo da mensagem
    thankYou.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Branding no console
console.log(
    '%c END Monitor — Programa de Co-criação ',
    'background: #00BFFF; color: #000; font-size: 16px; font-weight: bold; padding: 8px;'
);
