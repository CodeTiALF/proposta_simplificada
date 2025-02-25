function validarNumero(input) {
    input.value = input.value.replace(/\D/g, '');
}

function formatarValor(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = (parseFloat(valor) / 100).toFixed(2);
    if (!isNaN(valor)) {
        input.value = formatarNumero(parseFloat(valor));
    }
}

function formatarNumero(numero) {
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseNumero(texto) {
    if (!texto) return 0;
    return parseFloat(texto.replace(/\./g, '').replace(',', '.'));
}

function calcularDesconto() {
    const valorTabela = parseNumero(document.getElementById('valorTabela').value);
    const valorNegociado = parseNumero(document.getElementById('valorNegociado').value);
    const descontoIndicator = document.getElementById('descontoIndicator');

    if (isNaN(valorTabela) || isNaN(valorNegociado)) {
        document.getElementById('resultado').innerText = 'Digite valores válidos';
        descontoIndicator.textContent = '';
        return;
    }

    const desconto = ((valorTabela - valorNegociado) / valorTabela) * 100;
    document.getElementById('resultado').innerText = `Desconto: ${desconto.toFixed(2)}%`;
    
    // Atualizar indicador de valor
    if (valorTabela > 0 && valorNegociado > 0) {
        descontoIndicator.textContent = `R$ ${formatarNumero(valorTabela - valorNegociado)}`;
        if (desconto < 0) {
            descontoIndicator.style.color = '#ff0000';
        } else {
            descontoIndicator.style.color = 'var(--text-color)';
        }
    } else {
        descontoIndicator.textContent = '';
    }
    
    validarFormulario();
}

function validarFormulario() {
    const tabela = document.getElementById('tabela').value;
    const comprador = document.getElementById('comprador').value.trim();
    const imovel = document.getElementById('imovel').value.trim();
    const valorTabela = parseNumero(document.getElementById('valorTabela').value);
    const valorNegociado = parseNumero(document.getElementById('valorNegociado').value);
    const valorChaves = parseNumero(document.getElementById('valorChaves').value);
    const solicitante = document.getElementById('solicitante').value;
    const desconto = ((valorTabela - valorNegociado) / valorTabela) * 100;

    const shareButton = document.getElementById('shareButton');

    // Validar campos preenchidos e valores maiores que 0
    const camposValidos = tabela !== '' && 
                         comprador !== '' && 
                         imovel !== '' && 
                         valorTabela > 0 && 
                         valorNegociado > 0 && 
                         valorChaves > 0 &&
                         solicitante !== '';

    // Habilitar/desabilitar botão de compartilhar
    if (camposValidos) {
        shareButton.classList.add('enabled');
        // Salvar no cache quando os dados são válidos
        saveToCache();
    } else {
        shareButton.classList.remove('enabled');
    }

    return camposValidos;
}

function calcularPercentagemChaves() {
    const valorNegociado = parseNumero(document.getElementById('valorNegociado').value);
    const valorChaves = parseNumero(document.getElementById('valorChaves').value);
    const percentagemSpan = document.getElementById('percentagemChaves');

    if (valorNegociado > 0 && valorChaves > 0) {
        const percentagem = (valorChaves / valorNegociado) * 100;
        percentagemSpan.textContent = `${percentagem.toFixed(1)}%`;
    } else {
        percentagemSpan.textContent = '';
    }
    
    validarFormulario();
}

// Theme functionality
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
        // Save theme preference
        localStorage.setItem('theme', newTheme);
    });
}

function createFormalDocument() {
    const formalDoc = document.createElement('div');
    formalDoc.className = 'formal-document';
    
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'short',
        timeStyle: 'medium'
    });
    const dataHora = formatter.format(now).split(' ');
    const data = dataHora[0];
    const hora = dataHora[1];
    
    const tabela = document.getElementById('tabela').value;
    const comprador = document.getElementById('comprador').value;
    const imovel = document.getElementById('imovel').value;
    const valorTabela = parseNumero(document.getElementById('valorTabela').value);
    const valorNegociado = parseNumero(document.getElementById('valorNegociado').value);
    const valorChaves = parseNumero(document.getElementById('valorChaves').value);
    const solicitante = document.getElementById('solicitante').value;
    const desconto = ((valorTabela - valorNegociado) / valorTabela * 100).toFixed(2);
    const diferencaValor = valorTabela - valorNegociado;
    const percentagemChaves = ((valorChaves / valorNegociado) * 100).toFixed(1);

    formalDoc.innerHTML = `
        <div class="formal-header">
            <h2>Proposta Simplificada</h2>
            <p class="date-time">Data: ${data} - Hora: ${hora}</p>
        </div>
        <div class="formal-content">
            <div class="info-row">
                <strong>Solicitante:</strong> ${solicitante}
            </div>
            <div class="info-row">
                <strong>Tabela:</strong> ${tabela}
            </div>
            <div class="info-row">
                <strong>Unidade:</strong> ${imovel}
            </div>
            <div class="info-row">
                <strong>Comprador:</strong> ${comprador}
            </div>
            <div class="info-row">
                <strong>Valor de Tabela:</strong> R$ ${formatarNumero(valorTabela)}
            </div>
            <div class="info-row">
                <strong>Valor Negociado:</strong> R$ ${formatarNumero(valorNegociado)}
                <div class="sub-info">Diferença: R$ ${formatarNumero(diferencaValor)}</div>
            </div>
            <div class="info-row">
                <strong>Valor até as chaves:</strong> R$ ${formatarNumero(valorChaves)}
                <div class="sub-info">Percentual do valor negociado: ${percentagemChaves}%</div>
            </div>
            <div class="info-row result">
                <strong>Desconto:</strong> ${desconto}%
            </div>
        </div>
    `;
    
    return formalDoc;
}

async function saveLog(data) {
    try {
        const response = await fetch('save_log.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        return result.success;
    } catch (err) {
        console.error('Erro ao salvar log:', err);
        return false;
    }
}

async function shareScreenshot() {
    try {
        // Criar objeto de log
        const now = new Date();
        const brazilTime = new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const [date, time] = brazilTime.format(now).split(' ');
        const [day, month, year] = date.split('/');
        const formattedDate = `${year}-${month}-${day}T${time}.000Z`;
        
        const valorTabela = parseNumero(document.getElementById('valorTabela').value);
        const valorNegociado = parseNumero(document.getElementById('valorNegociado').value);
        const valorChaves = parseNumero(document.getElementById('valorChaves').value);
        const percentagemChaves = ((valorChaves / valorNegociado) * 100).toFixed(1);
        
        const logData = {
            data: formattedDate,
            tabela: document.getElementById('tabela').value,
            comprador: document.getElementById('comprador').value,
            imovel: document.getElementById('imovel').value,
            valorTabela: valorTabela,
            valorNegociado: valorNegociado,
            valorChaves: valorChaves,
            solicitante: document.getElementById('solicitante').value,
            desconto: ((valorTabela - valorNegociado) / valorTabela * 100).toFixed(2),
            percentagemChaves: percentagemChaves
        };

        // Primeiro salvar o log
        const logSaved = await saveLog(logData);
        if (!logSaved) {
            console.error('Falha ao salvar o log');
            // Continua mesmo se falhar o log para não impedir o compartilhamento
        }

        // Create and append formal document
        const formalDoc = createFormalDocument();
        document.body.appendChild(formalDoc);
        
        // Generate screenshot
        const canvas = await html2canvas(formalDoc);
        
        // Remove the temporary formal document
        document.body.removeChild(formalDoc);
        
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        // Format date for filename usando timezone de São Paulo
        const fileFormatter = new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const dataHora = fileFormatter.format(now).replace(/[/:\s]/g, '-');
        const imovel = document.getElementById('imovel').value;
        const comprador = document.getElementById('comprador').value;
        const filename = `City-${imovel}-${comprador}-${dataHora}.png`;

        if (navigator.share) {
            const file = new File([blob], filename, { type: 'image/png' });
            await navigator.share({
                files: [file],
                title: 'Relatório de Simulação de Desconto',
            });
        } else {
            // Fallback for browsers that don't support sharing
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = filename;
            link.click();
        }
    } catch (err) {
        console.error('Erro ao compartilhar:', err);
    }
}

// Funções de cache
function saveToCache() {
    const data = {
        tabela: document.getElementById('tabela').value,
        comprador: document.getElementById('comprador').value,
        imovel: document.getElementById('imovel').value,
        valorTabela: document.getElementById('valorTabela').value,
        valorNegociado: document.getElementById('valorNegociado').value,
        valorChaves: document.getElementById('valorChaves').value,
        solicitante: document.getElementById('solicitante').value
    };
    localStorage.setItem('simulacaoCache', JSON.stringify(data));
}

function loadFromCache() {
    const cachedData = localStorage.getItem('simulacaoCache');
    if (cachedData) {
        const data = JSON.parse(cachedData);
        document.getElementById('tabela').value = data.tabela || '';
        document.getElementById('comprador').value = data.comprador || '';
        document.getElementById('imovel').value = data.imovel || '';
        document.getElementById('valorTabela').value = data.valorTabela || '0,00';
        document.getElementById('valorNegociado').value = data.valorNegociado || '0,00';
        document.getElementById('valorChaves').value = data.valorChaves || '0,00';
        document.getElementById('solicitante').value = data.solicitante || '';
        
        // Recalcular valores
        calcularDesconto();
        calcularPercentagemChaves();
    }
}

// Adiciona função de submit
function handleFormSubmit(event) {
    event.preventDefault();
    shareScreenshot();
}

// Initialize when page loads
window.onload = function() {
    // Carregar dados do cache
    loadFromCache();
    
    // Se não houver dados no cache, inicializar com valores padrão
    if (!document.getElementById('valorTabela').value) {
        document.getElementById('valorTabela').value = '0,00';
        document.getElementById('valorNegociado').value = '0,00';
        document.getElementById('valorChaves').value = '0,00';
    }
    
    calcularDesconto();
    initTheme();
    
    // Add input event listeners for validation
    const inputs = ['tabela', 'comprador', 'imovel', 'valorTabela', 'valorNegociado', 'valorChaves', 'solicitante'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                calcularDesconto();
                calcularPercentagemChaves();
                validarFormulario();
            });
            // Adicionar evento change para o select
            if (element.tagName === 'SELECT') {
                element.addEventListener('change', () => {
                    validarFormulario();
                });
            }
        }
    });

    // Inicializar form submit
    const form = document.getElementById('descontoForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Initialize share button
    const shareButton = document.getElementById('shareButton');
    if (shareButton) {
        shareButton.addEventListener('click', event => {
            if (shareButton.classList.contains('enabled')) {
                event.preventDefault();
                const form = document.getElementById('descontoForm');
                form.dispatchEvent(new Event('submit'));
            }
        });
    }
};