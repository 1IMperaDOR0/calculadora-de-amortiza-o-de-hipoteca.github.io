// Evento de clique para seleção do tipo de hipoteca
let mortgageType = document.querySelector('.mortgageType');
mortgageType.addEventListener('click', (event) => {
    let target = event.target;
    let typeElement;
    if (target.classList.contains('mortgageTypeContent')) {
        typeElement = target;
    } else {
        typeElement = target.closest('.mortgageTypeContent');
    }
    if (typeElement) {
        let mortgageTypeContent = mortgageType.querySelectorAll('.mortgageTypeContent');
        mortgageTypeContent.forEach((type) => {
            type.classList.remove('active');
            let mortgageTypeOption = type.querySelector('.mortgageTypeOption');
            if (mortgageTypeOption) {
                mortgageTypeOption.classList.remove('active');
            }
        });
        typeElement.classList.add('active');
        let selectedType = typeElement.querySelector('.mortgageTypeOption');
        if (selectedType) {
            selectedType.classList.add('active');
        }
    }
});

// Função para aplicar o estilo baseado no foco e blur
function applyFocusStyle(inputSelector, containerSelector, paragraphSelector) {
    const inputElement = document.querySelector(inputSelector);
    const containerElement = document.querySelector(containerSelector);
    const paragraphElement = document.querySelector(paragraphSelector);

    inputElement.addEventListener('focus', () => {
        containerElement.style.borderColor = '#d9db30';
        paragraphElement.style.backgroundColor = '#d9db30';
    });

    inputElement.addEventListener('blur', () => {
        containerElement.style.borderColor = '';
        paragraphElement.style.backgroundColor = '';
    });
}

// Aplicando a função genérica para cada campo
applyFocusStyle('.mortgageAmountContent input', '.mortgageAmountContent', '.mortgageAmountContent p');
applyFocusStyle('.mortgageTerm-0 .mortgageTermContent input', '.mortgageTerm-0 .mortgageTermContent', '.mortgageTerm-0 .mortgageTermContent p:last-child');
applyFocusStyle('.mortgageTerm-1 .mortgageTermContent input', '.mortgageTerm-1 .mortgageTermContent', '.mortgageTerm-1 .mortgageTermContent p:last-child');

// Definindo o objeto validador
let validator = {
    handleSubmit: (event) => {
        event.preventDefault();
        let send = true;

        let inputs = document.querySelectorAll('input');
        let types = document.querySelectorAll('.mortgageType');

        validator.clearErrors(); // Limpa erros antes de começar a validação

        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            let check = validator.checkInput(input);
            if (check !== true) {
                send = false;
                validator.showError(input, check);
            }
        }

        for (let i = 0; i < types.length; i++) {
            let type = types[i];
            let check = validator.checkInput(type);
            if (check !== true) {
                send = false;
                validator.showError(type, check);
            }
        }

        if (send) {
            let results0 = document.querySelector('.results-0');
            results0.classList.remove('active');

            let results1 = document.querySelector('.results-1');
            results1.classList.add('active');

            calculateMortgage(); // Correção no nome da função de cálculo
        }
    },
    checkInput: (input) => {
        let erro = null;

        let rules = input.getAttribute('data-rules');
        if (rules !== null) {
            rules = rules.split('|');
            for (let r in rules) {
                let rule = rules[r];

                if (rule === 'required') {
                    if (input.value.trim() === '') {
                        erro = 'This field is required.';
                        break;
                    }
                } else if (rule === 'value') {
                    let regex = /^\d{1,3}(,\d{3})*(\.\d+)?$/; // permite apenas números, pontos e vírgulas
                    if (input.value !== '' && !regex.test(input.value)) {
                        erro = 'Please only enter numbers or numbers with dots.';
                        break;
                    }
                }
            }
        }

        if (input.classList.contains('mortgageType')) {
            let mortgageTypeContents = input.querySelectorAll('.mortgageTypeContent');
            let hasActive = Array.from(mortgageTypeContents).some((content) => content.classList.contains('active'));
            if (!hasActive) {
                erro = 'This field is required.';
            }
        }

        return erro || true;
    },
    showError: (input, error) => {
        let errorElement = document.createElement('div');
        errorElement.classList.add('error');
        errorElement.innerHTML = error;

        let label = input.closest('label');
        if (label) {
            label.appendChild(errorElement);
        } else if (input.classList.contains('mortgageType')) {
            let mortgageTypeContents = input.querySelectorAll('.mortgageTypeContent');
            mortgageTypeContents.forEach(content => {
                content.classList.add('styleError-0');
                let p = content.querySelector('p');
                if (p) {
                    p.classList.add('styleError-1');
                }
            });
        }

        let mortgageAmountContent = input.closest('.mortgageAmountContent');
        if (mortgageAmountContent) {
            mortgageAmountContent.classList.add('styleError-0');
            let mortgageAmountP = mortgageAmountContent.querySelector('p');
            if (mortgageAmountP) {
                mortgageAmountP.classList.add('styleError-1');
            }
        }

        let mortgageTermContent = input.closest('.mortgageTermContent');
        if (mortgageTermContent) {
            mortgageTermContent.classList.add('styleError-0');
            let mortgageTermP = mortgageTermContent.querySelector('p');
            if (mortgageTermP) {
                mortgageTermP.classList.add('styleError-1');
            }
        }
    },
    clearErrors: () => {
        document.querySelectorAll('.error').forEach(element => {
            element.remove();
        });

        document.querySelectorAll('.mortgageAmountContent, .mortgageTermContent').forEach(element => {
            element.classList.remove('styleError-0');
            let p = element.querySelector('p');
            if (p) {
                p.classList.remove('styleError-1');
            }
        });
    }
};

// Função para formatar o input de valores numéricos
function formatNumberInput(inputElement) {
    let value = inputElement.value.replace(/[^0-9.]/g, ''); // Remove caracteres inválidos
    let parts = value.split('.'); // Dividir em parte inteira e decimal
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Adicionar vírgulas na parte inteira
    inputElement.value = parts.length > 1 ? parts.join('.') : parts[0]; // Rejuntar parte inteira e decimal
}

// Aplicar a formatação no input de valor da hipoteca
let mortgageAmountInput = document.querySelector('.mortgageAmountContent input');
mortgageAmountInput.addEventListener('input', function () {
    formatNumberInput(this);
});

// Função de cálculo da hipoteca
function calculateMortgage() {
    // Capturar os valores dos inputs
    let mortgageAmountInput = document.querySelector('.mortgageAmountContent input').value;
    let mortgageTermInput = document.querySelector('.mortgageTerm-0 input').value;
    let interestRateInput = document.querySelector('.mortgageTerm-1 input').value;
    
    // Remover as vírgulas dos valores
    let mortgageAmount = parseFloat(mortgageAmountInput.replace(/,/g, ''));
    let mortgageTerm = parseInt(mortgageTermInput);
    let interestRate = parseFloat(interestRateInput) / 100;

    if (isNaN(mortgageAmount) || isNaN(mortgageTerm) || isNaN(interestRate)) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    // Identificar o tipo de hipoteca selecionado
    let isInterestOnly = document.querySelector('.mortgageTypeContent.active').textContent.includes('Interest Only');

    if (isInterestOnly) {
        // Cálculo de "Interest Only": apenas os juros mensais
        let monthlyPayment = mortgageAmount * (interestRate / 12);

        // Cálculo do total pago ao longo do tempo (somente juros)
        let totalPayment = monthlyPayment * (mortgageTerm * 12);

        // Exibir os resultados formatados
        document.querySelector('.results-1-infoMonthly h1').textContent = formatNumber(`£${monthlyPayment.toFixed(2)}`);
        document.querySelector('.results-1-infoTotal h1').textContent = formatNumber(`£${totalPayment.toFixed(2)}`);
    } else {
        // Cálculo regular de hipoteca com amortização
        let monthlyRate = interestRate / 12;
        let numberOfPayments = mortgageTerm * 12;

        // Fórmula para calcular o pagamento mensal
        let monthlyPayment = mortgageAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
        
        // Cálculo do total a ser pago
        let totalPayment = monthlyPayment * numberOfPayments;

        // Exibir os resultados formatados
        document.querySelector('.results-1-infoMonthly h1').textContent = formatNumber(`£${monthlyPayment.toFixed(2)}`);
        document.querySelector('.results-1-infoTotal h1').textContent = formatNumber(`£${totalPayment.toFixed(2)}`);
    }
}

// Função para adicionar vírgulas no número exibido
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Bloquear o envio e calcular ao clicar no botão de cálculo
let form = document.querySelector('.validator');
form.addEventListener('submit', validator.handleSubmit);

// Evento de clique para limpar o formulário
document.querySelector("span").addEventListener("click", function() {
    clearAll();
});

// Função para limpar o formulário
function clearAll() {
    // Limpar todos os inputs dentro do formulário com a classe '.validator'
    var entradas = document.querySelectorAll('.validator input');
    entradas.forEach(entrada => {
        console.log("Limpando input:", entrada);
        entrada.value = '';
    });

    // Resetar seleção ativa dos tipos de hipoteca
    document.querySelectorAll('.mortgageTypeContent').forEach(content => {
        content.classList.remove('active');
        let option = content.querySelector('.mortgageTypeOption');
        if (option) {
            option.classList.remove('active');
        }
    });

    // Resetar os resultados exibidos
    document.querySelector('.results-1').classList.remove('active');
    document.querySelector('.results-0').classList.add('active');

    // Limpar mensagens de erro
    validator.clearErrors();
}