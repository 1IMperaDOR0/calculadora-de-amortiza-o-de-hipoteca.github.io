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
            mortgageTypeOption.classList.remove('active');
        });
        typeElement.classList.add('active');
        let selectedType = typeElement.querySelector('.mortgageTypeOption');
        if (selectedType) {
            selectedType.classList.add('active');
        }
    }
});

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
    let mortgageAmountInput = document.querySelector('.mortgageAmountContent input').value;
    let mortgageTermInput = document.querySelector('.mortgageTerm-0 input').value;
    let interestRateInput = document.querySelector('.mortgageTerm-1 input').value;

    let mortgageAmount = parseFloat(mortgageAmountInput.replace(/,/g, '')); // Remover vírgulas
    let mortgageTerm = parseInt(mortgageTermInput);
    let interestRate = parseFloat(interestRateInput) / 100;

    if (isNaN(mortgageAmount) || isNaN(mortgageTerm) || isNaN(interestRate)) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    let monthlyRate = interestRate / 12;
    let numberOfPayments = mortgageTerm * 12;
    let monthlyPayment = mortgageAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    let totalPayment = monthlyPayment * numberOfPayments;

    document.querySelector('.results-1-infoMonthly h1').textContent = formatNumber(monthlyPayment.toFixed(2));
    document.querySelector('.results-1-infoTotal h1').textContent = formatNumber(totalPayment.toFixed(2));
}

// Função para adicionar vírgulas no número exibido
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Bloquear o envio e calcular ao clicar no botão
let form = document.querySelector('.validator');
form.addEventListener('submit', validator.handleSubmit);