// Removendo e adicionando a active nas class mortgageTypeContent e mortgageTypeOption
let mortgageType = document.querySelector('.mortgageType');

mortgageType.addEventListener('click', (event) => {
    let target = event.target;
    let typeElement;
    if(target.classList.contains('mortgageTypeContent')) {
        typeElement = target;
    } else {
        typeElement = target.closest('.mortgageTypeContent');
    };
    if(typeElement) {
        let mortgageTypeContent = mortgageType.querySelectorAll('.mortgageTypeContent');
        mortgageTypeContent.forEach((type) => {
            type.classList.remove('active');
            let mortgageTypeOption = type.querySelector('.mortgageTypeOption');
            mortgageTypeOption.classList.remove('active');
        });
        typeElement.classList.add('active');
        let selectedType = typeElement.querySelector('.mortgageTypeOption');
        if(selectedType) {
            selectedType.classList.add('active')
        };
    };
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

            calcularResultados(); // Chamando a função para calcular e exibir os resultados
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
                    };
                } else if (rule === 'value') {
                    let regex = /^\d+(?:\.\d+)?$/; // permite apenas números e pontos
                    if (input.value !== '' && !regex.test(input.value)) {
                        erro = 'Please only enter numbers or numbers with dots';
                        break;
                    };
                };
            };
        };

        if (input.classList.contains('mortgageType')) {
            let mortgageTypeContents = input.querySelectorAll('.mortgageTypeContent');
            let hasActive = Array.from(mortgageTypeContents).some((content) => content.classList.contains('active'));
            if (!hasActive) {
                erro = 'This field is required.';
            };
        };

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
        };

        let mortgageAmountContent = input.closest('.mortgageAmountContent');
        if (mortgageAmountContent) {
            mortgageAmountContent.classList.add('styleError-0');
            
            let mortgageAmountP = mortgageAmountContent.querySelector('p');
            if (mortgageAmountP) {
                mortgageAmountP.classList.add('styleError-1');
            }
        };

        let mortgageTermContent = input.closest('.mortgageTermContent');
        if (mortgageTermContent) {
            mortgageTermContent.classList.add('styleError-0');

            let mortgageTermP = mortgageTermContent.querySelector('p');
            if (mortgageTermP) {
                mortgageTermP.classList.add('styleError-1');
            }
        };
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

// Criando a função para os cálculos
function calcularResultados() {
    // Capturando os valores dos inputs e removendo pontos e vírgulas para converter em número
    let valorPrincipal = parseFloat(
        document.querySelector('.mortgageAmountContent input').value.replace(/\./g, '').replace(',', '.')
    );
    let anos = parseInt(document.querySelector('.mortgageTerm-0 input').value);
    let taxaAnual = parseFloat(
        document.querySelector('.mortgageTerm-1 input').value.replace(',', '.')
    );
    let somenteJuros = document.querySelector('.mortgageTypeContent.active h3').textContent === 'Interest Only';

    // Calculando o pagamento mensal e o total
    let taxaMensal = taxaAnual / 12 / 100;
    let totalPagamentos = anos * 12;
    let pagamentoMensal, totalPagamento;

    if (somenteJuros) {
        pagamentoMensal = valorPrincipal * taxaMensal;
        totalPagamento = pagamentoMensal * totalPagamentos;
    } else {
        pagamentoMensal = (valorPrincipal * taxaMensal * Math.pow(1 + taxaMensal, totalPagamentos)) /
                          (Math.pow(1 + taxaMensal, totalPagamentos) - 1);
        totalPagamento = pagamentoMensal * totalPagamentos;
    }

    // Atualizando os resultados na interface com formatação
    document.querySelector('.results-1-infoMonthly h1').textContent = `£${pagamentoMensal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.querySelector('.results-1-infoTotal h1').textContent = `£${totalPagamento.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Exibindo os resultados
    document.querySelector('.results-0').classList.remove('active');
    document.querySelector('.results-1').classList.add('active');
}

// Criando uma função para limpar o formulário
document.querySelector("span").addEventListener("click", function() {
    clearAll("limpar");
});
  
function clearAll(name) {
    var entradas = document.querySelectorAll("input[name='"+name+"']");
    [].map.call(entradas, entrada => entrada.value = '');
}

// Selecionando o formulário
let form = document.querySelector('.validator');

// Bloqueando o envio
form.addEventListener('submit', validator.handleSubmit);