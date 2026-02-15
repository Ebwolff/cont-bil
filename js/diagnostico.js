// ========================================
// DIAGNÓSTICO DE RISCO TRIBUTÁRIO
// ========================================

let currentStep = 1;
const totalSteps = 4;
const formData = {};

// ========================================
// OPTION CARDS — SELEÇÃO
// ========================================

document.querySelectorAll('.option-cards').forEach(container => {
    const cards = container.querySelectorAll('.option-card');
    const fieldName = container.getAttribute('data-field');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove seleção anterior
            cards.forEach(c => c.classList.remove('selected'));
            // Seleciona atual
            card.classList.add('selected');
            // Salva valor
            formData[fieldName] = card.getAttribute('data-value');

            // Remove erro se existir
            const errorEl = document.getElementById(`${fieldName}-error`);
            if (errorEl) errorEl.classList.remove('visible');

            // Mostra insights se aplicável
            showInsight(fieldName, card.getAttribute('data-value'));
        });
    });
});

// ========================================
// INSIGHTS DINÂMICOS
// ========================================

function showInsight(field, value) {
    // Insight de preparação
    if (field === 'preparacao') {
        const insight = document.getElementById('insight-preparacao');
        if (value === 'nao' || value === 'parcial') {
            insight.classList.remove('hidden');
        } else {
            insight.classList.add('hidden');
        }
    }

    // Insight de problemas
    if (field === 'problemas') {
        const insight = document.getElementById('insight-problemas');
        if (value === 'nao-sei' || value === 'sim-frequente') {
            insight.classList.remove('hidden');
        } else {
            insight.classList.add('hidden');
        }
    }

    // Insight de descoberta
    if (field === 'descoberta') {
        const insight = document.getElementById('insight-descoberta');
        if (value === 'manual' || value === 'auditoria' || value === 'fisco') {
            insight.classList.remove('hidden');
        } else {
            insight.classList.add('hidden');
        }
    }
}

// ========================================
// CONFIDENCE SLIDER
// ========================================

const confiancaSlider = document.getElementById('d-confianca');
const confiancaValue = document.getElementById('confiancaValue');

if (confiancaSlider) {
    confiancaSlider.addEventListener('input', () => {
        confiancaValue.textContent = confiancaSlider.value;

        // Cor dinâmica
        const val = parseInt(confiancaSlider.value);
        if (val <= 3) {
            confiancaValue.style.color = '#FF4444';
        } else if (val <= 6) {
            confiancaValue.style.color = '#FFD700';
        } else {
            confiancaValue.style.color = '#00FF88';
        }
    });
}

// ========================================
// PHONE MASK
// ========================================

const telInput = document.getElementById('d-telefone');
if (telInput) {
    telInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length <= 11) {
            if (value.length <= 2) {
                e.target.value = value.replace(/(\d{0,2})/, '($1');
            } else if (value.length <= 6) {
                e.target.value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
            } else if (value.length <= 10) {
                e.target.value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else {
                e.target.value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        } else {
            e.target.value = e.target.value.slice(0, -1);
        }
    });
}

// ========================================
// NAVIGATION
// ========================================

function nextStep() {
    if (!validateCurrentStep()) return;

    if (currentStep < totalSteps) {
        currentStep++;
        updateStep();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStep();
    }
}

function updateStep() {
    // Update form steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    const activeStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (activeStep) activeStep.classList.add('active');

    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;

    // Update progress dots
    document.querySelectorAll('.progress-step').forEach(dot => {
        const stepNum = parseInt(dot.getAttribute('data-step'));
        dot.classList.remove('active', 'completed');

        if (stepNum === currentStep) {
            dot.classList.add('active');
        } else if (stepNum < currentStep) {
            dot.classList.add('completed');
        }
    });

    // Scroll to top of form
    document.querySelector('.progress-container').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ========================================
// VALIDATION
// ========================================

function validateCurrentStep() {
    let isValid = true;

    if (currentStep === 1) {
        // Validate nome
        const nome = document.getElementById('d-nome');
        if (!nome.value.trim()) {
            nome.classList.add('error');
            nome.nextElementSibling.classList.add('visible');
            isValid = false;
        } else {
            nome.classList.remove('error');
            nome.nextElementSibling.classList.remove('visible');
        }

        // Validate empresa
        const empresa = document.getElementById('d-empresa');
        if (!empresa.value.trim()) {
            empresa.classList.add('error');
            empresa.nextElementSibling.classList.add('visible');
            isValid = false;
        } else {
            empresa.classList.remove('error');
            empresa.nextElementSibling.classList.remove('visible');
        }

        // Validate perfil
        if (!formData.perfil) {
            document.getElementById('perfil-error').classList.add('visible');
            isValid = false;
        }
    }

    if (currentStep === 2) {
        if (!formData.volume) {
            document.getElementById('volume-error').classList.add('visible');
            isValid = false;
        }

        if (!formData.preparacao) {
            document.getElementById('preparacao-error').classList.add('visible');
            isValid = false;
        }
    }

    if (currentStep === 3) {
        if (!formData.problemas) {
            document.getElementById('problemas-error').classList.add('visible');
            isValid = false;
        }

        if (!formData.descoberta) {
            document.getElementById('descoberta-error').classList.add('visible');
            isValid = false;
        }
    }

    if (currentStep === 4) {
        // Validate email
        const email = document.getElementById('d-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.classList.add('error');
            email.nextElementSibling.classList.add('visible');
            isValid = false;
        } else {
            email.classList.remove('error');
            email.nextElementSibling.classList.remove('visible');
        }

        // Validate telefone
        const telefone = document.getElementById('d-telefone');
        if (telefone.value.replace(/\D/g, '').length < 10) {
            telefone.classList.add('error');
            telefone.nextElementSibling.classList.add('visible');
            isValid = false;
        } else {
            telefone.classList.remove('error');
            telefone.nextElementSibling.classList.remove('visible');
        }

        // Validate LGPD
        const lgpd = document.getElementById('d-lgpd');
        if (!lgpd.checked) {
            document.getElementById('lgpd-error').classList.add('visible');
            isValid = false;
        } else {
            document.getElementById('lgpd-error').classList.remove('visible');
        }
    }

    return isValid;
}

// Remove error on input
document.querySelectorAll('.field-group input, .field-group select, .field-group textarea').forEach(el => {
    el.addEventListener('input', () => {
        el.classList.remove('error');
        const errorEl = el.nextElementSibling;
        if (errorEl && errorEl.classList.contains('field-error')) {
            errorEl.classList.remove('visible');
        }
    });
});

// ========================================
// SUBMIT & CALCULATE RISK
// ========================================

function submitDiagnostico() {
    if (!validateCurrentStep()) return;

    // Collect all data
    formData.nome = document.getElementById('d-nome').value;
    formData.empresa = document.getElementById('d-empresa').value;
    formData.email = document.getElementById('d-email').value;
    formData.telefone = document.getElementById('d-telefone').value;
    formData.horario = document.getElementById('d-horario').value;
    formData.desafio = document.getElementById('d-desafio').value;
    formData.confianca = document.getElementById('d-confianca').value;
    formData.timestamp = new Date().toISOString();

    console.log('Diagnóstico submetido:', formData);

    // Calculate risk
    const riskScore = calculateRisk();

    // Show result
    showResult(riskScore);
}

function calculateRisk() {
    let score = 0;
    let maxScore = 0;

    // Volume de documentos (mais docs = mais risco)
    const volumeCard = document.querySelector('[data-field="volume"] .option-card.selected');
    if (volumeCard) {
        score += parseInt(volumeCard.getAttribute('data-risk') || 0);
        maxScore += 4;
    }

    // Preparação
    const prepCard = document.querySelector('[data-field="preparacao"] .option-card.selected');
    if (prepCard) {
        score += parseInt(prepCard.getAttribute('data-risk') || 0);
        maxScore += 4;
    }

    // Problemas anteriores
    const probCard = document.querySelector('[data-field="problemas"] .option-card.selected');
    if (probCard) {
        score += parseInt(probCard.getAttribute('data-risk') || 0);
        maxScore += 4;
    }

    // Como descobre erros
    const descCard = document.querySelector('[data-field="descoberta"] .option-card.selected');
    if (descCard) {
        score += parseInt(descCard.getAttribute('data-risk') || 0);
        maxScore += 5;
    }

    // Confiança (inverso: menor confiança = maior risco)
    const conf = parseInt(document.getElementById('d-confianca').value);
    const confRisk = Math.ceil((10 - conf) / 2.5); // 1-4
    score += confRisk;
    maxScore += 4;

    // Normalizar para 0-100
    return Math.round((score / maxScore) * 100);
}

function showResult(riskScore) {
    // Hide form, show result
    document.getElementById('diagnosticoForm').style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    const resultScreen = document.getElementById('resultScreen');
    resultScreen.classList.remove('hidden');

    // Set name
    document.getElementById('resultName').textContent =
        `${formData.nome}, da ${formData.empresa}`;

    // Determine risk level
    let level, color, details;

    if (riskScore <= 25) {
        level = 'BAIXO';
        color = '#00FF88';
        details = getDetailsLow();
    } else if (riskScore <= 50) {
        level = 'MÉDIO';
        color = '#FFD700';
        details = getDetailsMedium();
    } else if (riskScore <= 75) {
        level = 'ALTO';
        color = '#FF8C00';
        details = getDetailsHigh();
    } else {
        level = 'CRÍTICO';
        color = '#FF4444';
        details = getDetailsCritical();
    }

    // Animate gauge
    const gaugeLevel = document.getElementById('gaugeLevel');
    const gaugeFill = document.getElementById('gaugeFill');

    gaugeLevel.textContent = level;
    gaugeLevel.style.color = color;

    // Set gauge colors
    gaugeFill.style.borderTopColor = color;
    gaugeFill.style.borderRightColor = color;

    // Animate rotation based on score (225deg = 0%, 225 + 270 = 495deg = 100%)
    const rotation = 225 + (riskScore / 100) * 270;
    setTimeout(() => {
        gaugeFill.style.transform = `rotate(${rotation}deg)`;
    }, 100);

    // Render details
    const detailsContainer = document.getElementById('resultDetails');
    detailsContainer.innerHTML = details.map(d =>
        `<div class="result-item ${d.risk}">
            <i class="fas ${d.icon}"></i>
            <div>
                <h4>${d.title}</h4>
                <p>${d.text}</p>
            </div>
        </div>`
    ).join('');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// RESULT DETAILS (por nível de risco)
// ========================================

function getDetailsLow() {
    return [
        {
            icon: 'fa-check-circle',
            risk: '',
            title: 'Boa preparação inicial',
            text: 'Sua empresa demonstra um bom nível de consciência sobre a Reforma Tributária. Continue acompanhando de perto.'
        },
        {
            icon: 'fa-lightbulb',
            risk: 'risk-medium',
            title: 'Oportunidade de otimização',
            text: 'Mesmo com risco baixo, um monitoramento automatizado pode identificar créditos tributários que estão passando despercebidos.'
        },
        {
            icon: 'fa-shield-alt',
            risk: '',
            title: 'Prevenção é a melhor estratégia',
            text: 'Manter o monitoramento contínuo garante que nenhuma mudança regulatória pegue sua empresa desprevenida.'
        }
    ];
}

function getDetailsMedium() {
    return [
        {
            icon: 'fa-exclamation-triangle',
            risk: 'risk-medium',
            title: 'Vulnerabilidades identificadas',
            text: 'Existem pontos na sua operação que podem gerar problemas durante a transição para o novo modelo tributário.'
        },
        {
            icon: 'fa-clock',
            risk: 'risk-medium',
            title: 'Tempo é um fator crítico',
            text: 'Com a dupla operação IBS/CBS chegando, postergar a preparação pode transformar riscos médios em problemas sérios.'
        },
        {
            icon: 'fa-dollar-sign',
            risk: 'risk-high',
            title: 'Risco de perda de créditos',
            text: 'A falta de monitoramento automatizado sugere que créditos tributários podem estar sendo perdidos sem que ninguém perceba.'
        }
    ];
}

function getDetailsHigh() {
    return [
        {
            icon: 'fa-fire',
            risk: 'risk-high',
            title: 'Exposição significativa',
            text: 'Sua empresa está significativamente exposta aos riscos da transição tributária. Ações corretivas são urgentes.'
        },
        {
            icon: 'fa-exclamation-circle',
            risk: 'risk-high',
            title: 'Detecção tardia de erros',
            text: 'O método atual de identificação de erros não é suficiente para o volume e complexidade da sua operação durante a Reforma.'
        },
        {
            icon: 'fa-money-bill-wave',
            risk: 'risk-high',
            title: 'Prejuízo financeiro provável',
            text: 'Sem monitoramento em tempo real, a probabilidade de multas e perda de créditos tributários é alta nos próximos meses.'
        },
        {
            icon: 'fa-robot',
            risk: '',
            title: 'Solução recomendada',
            text: 'Um agente inteligente de monitoramento contínuo pode reduzir drasticamente seu nível de risco, atuando antes que erros se transformem em prejuízos.'
        }
    ];
}

function getDetailsCritical() {
    return [
        {
            icon: 'fa-skull-crossbones',
            risk: 'risk-high',
            title: 'Situação crítica',
            text: 'Sua empresa está em uma posição de altíssimo risco para enfrentar a Reforma Tributária. Ações imediatas são necessárias.'
        },
        {
            icon: 'fa-gavel',
            risk: 'risk-high',
            title: 'Risco real de autuação',
            text: 'A combinação de alto volume de documentos, falta de preparação e detecção tardia de erros coloca sua empresa na mira da fiscalização.'
        },
        {
            icon: 'fa-chart-line',
            risk: 'risk-high',
            title: 'Prejuízo acumulativo',
            text: 'Cada dia sem monitoramento adequado multiplica o prejuízo potencial. Créditos perdidos, multas e retrabalho se acumulam silenciosamente.'
        },
        {
            icon: 'fa-shield-alt',
            risk: '',
            title: 'Ação urgente recomendada',
            text: 'Implementar um sistema de monitoramento inteligente em tempo real não é mais opcional — é uma necessidade urgente para proteger sua empresa.'
        }
    ];
}

// ========================================
// SHARE FUNCTIONS
// ========================================

function shareWhatsApp() {
    const text = encodeURIComponent(
        'Fiz um diagnóstico gratuito de risco tributário para a Reforma de 2026. Recomendo! 👉 ' +
        window.location.href
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function copyDiagLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = document.querySelector('.share-btn.copy');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = 'var(--primary-green)';
        btn.style.borderColor = 'var(--primary-green)';
        btn.style.color = 'var(--dark-bg)';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 2000);
    });
}

// ========================================
// CONSOLE BRANDING
// ========================================

console.log(
    '%c END Monitor — Diagnóstico de Risco ',
    'background: #00FF88; color: #000; font-size: 16px; font-weight: bold; padding: 8px;'
);
