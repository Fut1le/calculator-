document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const modeSwitchButtons = document.querySelectorAll('.mode');
    const calculator = document.getElementById('calculator');
    const display = document.getElementById('display');
    const historyList = document.getElementById('history-list');
    const toggleHistoryButton = document.getElementById('toggle-history');
    const clearHistoryButton = document.getElementById('clear-history');

    let currentMode = 'basic';
    let calcState = '';
    let history = JSON.parse(localStorage.getItem('history')) || [];
    let theme = localStorage.getItem('theme') || 'light';

    const basicButtons = [
        '7', '8', '9', '/', 
        '4', '5', '6', '*', 
        '1', '2', '3', '-', 
        '0', '.', '=', '+',
        'Clear', 'Erase', '(', ')'
    ];

    const scientificButtons = [
        ...basicButtons,
        'sin', 'cos', 'tan', 'log',
        'sqrt', 'pow', '^', 'π'
    ];

    const programmerButtons = [
        'A', 'B', 'C', 'D', 'E', 'F', 'AND', 'OR', 'XOR', 'NOT',
        'bin', 'oct', 'dec', 'hex', 'Clear',
        '>>', '<<', '(', ')', 'Erase'
    ];

    const renderButtons = (buttons) => {
        const buttonsContainer = document.getElementById('buttons');
        buttonsContainer.innerHTML = '';
        buttons.forEach(text => {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', () => handleButtonClick(text));
            buttonsContainer.appendChild(button);
        });
    };

    const renderHistory = () => {
        historyList.innerHTML = '';
        history.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.expression + " = " + item.result;
            historyList.appendChild(listItem);
        });
    };

    const handleButtonClick = (text) => {
        console.log(text);  // For debugging
        switch (text) {
            case '=':
                try {
                    if (currentMode === 'basic' || currentMode === 'scientific') {
                        const result = eval(calcState);
                        display.value = result;
                        history.push({expression: calcState, result: result});
                        calcState = result.toString();
                    }
                    localStorage.setItem('history', JSON.stringify(history));
                    renderHistory();
                } catch (err) {
                    display.value = 'Error';
                }
                break;
            case 'Clear':
                calcState = '';
                display.value = '';
                break;
            case 'Erase':
                calcState = calcState.slice(0, -1);
                display.value = calcState;
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'sqrt':
            case 'pow':
            case 'π':
                handleScientificFunctions(text);
                break;
            case 'bin':
            case 'oct':
            case 'dec':
            case 'hex':
                handleProgrammerFunctions(text);
                
                break;
            case 'AND':
            case 'OR':
            case 'XOR':
            case 'NOT':
            case '<<':
            case '>>':
                handleBitwiseOperations(text);
                break;
            default:
                calcState += text;
                display.value = calcState;
                break;
        }
    };
    
    const handleScientificFunctions = (func) => {
        const PI = Math.PI;
        try {
            switch (func) {
                case 'sin':
                    calcState = Math.sin(eval(calcState)).toString();
                    break;
                case 'cos':
                    calcState = Math.cos(eval(calcState)).toString();
                    break;
                case 'tan':
                    calcState = Math.tan(eval(calcState)).toString();
                    break;
                case 'log':
                    calcState = Math.log(eval(calcState)).toString();
                    break;
                case 'sqrt':
                    calcState = Math.sqrt(eval(calcState)).toString();
                    break;
                case 'pow':
                    const parts = calcState.split('^');
                    calcState = Math.pow(eval(parts[0]), eval(parts[1])).toString();
                    break;
                case 'π':
                    calcState = PI.toString();
                    break;
            }
            display.value = calcState;
        } catch (err) {
            display.value = 'Error';
        }
    };
    
    const handleProgrammerFunctions = (func) => {
        switch (func) {
            case 'bin':
                display.value = parseInt(calcState, 10).toString(2);
                break;
            case 'oct':
                display.value = parseInt(calcState, 10).toString(8);
                break;
            case 'dec':
                display.value = calcState;
                break;
            case 'hex':
                display.value = parseInt(calcState, 10).toString(16);
                break;
        }
    };
    
    const handleBitwiseOperations = (operation) => {
        const parts = calcState.split(' ');
        const left = parseInt(parts[0], 10);
        const right = parts[2] ? parseInt(parts[2], 10) : null;
        switch (operation) {
            case 'AND':
                calcState = (left & right).toString();
                break;
            case 'OR':
                calcState = (left | right).toString();
                break;
            case 'XOR':
                calcState = (left ^ right).toString();
                break;
            case 'NOT':
                calcState = (~left).toString();
                break;
            case '<<':
                calcState = (left << right).toString();
                break;
            case '>>':
                calcState = (left >> right).toString();
                break;
        }
        display.value = calcState;
    };
    
    display.addEventListener('input', (e) => {
        calcState = e.target.value;
    });
    
    // Toggle history visibility
    toggleHistoryButton.addEventListener('click', () => {
        const historyDiv = document.getElementById('history');
        if (historyDiv.style.display === 'none') {
            historyDiv.style.display = 'block';
        } else {
            historyDiv.style.display = 'none';
        }
    });
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        theme = document.body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
    
    modeSwitchButtons.forEach(btn => {
        btn.addEventListener('click', e => {
            currentMode = e.target.dataset.mode;
            switch (currentMode) {
                case 'basic':
                    renderButtons(basicButtons);
                    break;
                case 'scientific':
                    renderButtons(scientificButtons);
                    break;
                case 'programmer':
                    
                    renderButtons(programmerButtons);
                    break;
            }
            calcState = '';
            display.value = '';
        });
    });
    
    clearHistoryButton.addEventListener('click', () => {
        history = [];
        localStorage.setItem('history', JSON.stringify(history));
        renderHistory();
    });
    
    const initialize = () => {
        renderButtons(basicButtons);  // Default to basic buttons on load
        renderHistory();
        if (theme === 'dark') {
            document.body.classList.add('dark');
        }
        
        display.disabled = false;  // Make the display editable
    };
    
    initialize();
});
