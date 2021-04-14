function Viewport() {
    let setViewport = function () {
        let vh = window.innerHeight * 0.01;
        let vw = window.innerWidth * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}px`);
    };

    setViewport();
    window.addEventListener('resize', setViewport);
}

function FontSize() {
    let setFontSize = function () {
        let form = Array.from(document.getElementById('buttons'));
        let viewport = Math.min((window.innerHeight * 0.01), (window.innerWidth * 0.01));

        form.forEach(function (item) {
            let normal = 0;
            switch (item.defaultValue.length) {
                case 1:
                    normal = 1;
                    break;
                case 2:
                    normal = 1.3;
                    break;
                case 3:
                    normal = 1.6;
            }
            item.style.fontSize = `${(9 * viewport) / normal}px`;
        });
    };

    setFontSize();
    window.addEventListener('resize', setFontSize);
}

function InputEventStyle(event, target) {
    switch (event.type) {
        case 'pointerover':
            if (event.pointerType === 'mouse')
                target.style.boxShadow = `1px 1px 3px 2px var(--${target.className}), 
                                      inset 0 0 60px 10px var(--${target.className}-alpha)`;
            break;
        case 'pointerout':
            target.style.boxShadow = `1px 1px 3px 2px var(--${target.className})`;
            target.style.removeProperty('transform');
            target.style.textShadow = `1px 1px var(--${target.className})`;
            break;
        case 'pointerdown':
            target.style.boxShadow = `0 0 3px 2px var(--${target.className}), 
                                  inset 0 0 60px 10px var(--${target.className}-alpha)`;
            target.style.transform = 'translate(1px, 3px)';
            target.style.textShadow = `0 0 3px var(--${target.className})`;
            break;
        case 'pointerup':
            if (event.pointerType === 'mouse')
                target.style.boxShadow = `1px 1px 3px 2px var(--${target.className}), 
                                  inset 0 0 60px 10px var(--${target.className}-alpha)`;
            target.style.removeProperty('transform');
            target.style.textShadow = `1px 1px var(--${target.className})`;
            break;
    }
}

function ButtonsHover() {
    let form = document.getElementById('buttons');
    DisplayUpdate();

    form.addEventListener('pointerover', function (e) {
        let target = document.elementFromPoint(e.clientX, e.clientY);
        if ((target !== form) && (e.isPrimary)) {
            InputEventStyle(e, target);
            target.addEventListener('pointerout', function (event) {
                InputEventStyle(event, this);
            });
        }
    });

    form.addEventListener('pointerdown', function (e) {
        let target = document.elementFromPoint(e.clientX, e.clientY);
        if ((target !== form) && (e.isPrimary)) {
            InputEventStyle(e, target);
            target.addEventListener('pointerup', function (event) {
                InputEventStyle(event, this)
            });

            Operate(target);
            DisplayUpdate();
        }
    });
}

let operation = {
    first: '',
    op: '',
    second: '',
    current: 'first',
    result: '',
    calc() {
        switch (this.op) {
            case '+':
                return +this.first + +this.second;
            case '-':
                return +this.first - +this.second;
            case '×':
                return +this.first * +this.second;
            case '÷':
                return +this.first / +this.second;
            case '%':
                return +this.first % +this.second;
            case '^':
                return (+this.first) ** +this.second;
        }
    },
};


function Operate(key) {
    if (key.className === 'number' || (key.id === 'subtract-key' && operation[operation.current].length === 0)) {
        if (operation.result !== '') {
            operation.first = '';
            operation.op = '';
            operation.second = '';
            operation.current = 'first';
            operation.result = '';
        }

        if (key.defaultValue === '.' && !operation[operation.current].includes('.')) {
            if (operation[operation.current].length >= 2) {
                operation[operation.current] += key.defaultValue;
            } else if (operation[operation.current].length !== 0 && operation[operation.current][0] !== '-') {
                operation[operation.current] += key.defaultValue;
            }
        } else if (key.defaultValue !== '.') {
            operation[operation.current] += key.defaultValue;
        }
    } else if (key.className === 'operator' && (operation[operation.current].length >= 2 ||
                operation[operation.current].length !== 0 && operation[operation.current][0] !== '-')) {
        if (operation.result !== '') {
            operation.first = operation.result;
            operation.op = '';
            operation.second = '';
            operation.current = 'first';
            operation.result = '';
        }

        if (operation.current === 'first') {
            operation.op = (key.defaultValue === 'xʸ') ? '^' : key.defaultValue;
            operation.current = 'second';
        } else {
            operation.first = String(operation.calc());
            operation.second = '';
            operation.op = (key.defaultValue === 'xʸ') ? '^' : key.defaultValue;
        }
    } else if (key.className === 'equals' && operation.second.length !== 0) {
        if (operation.second[0] !== '-' || operation.second.length >= 2) {
            operation.result = String(operation.calc());
            operation.current = 'first';
        }
    } else if (key.className === 'delete') {
        if (key.id === 'clear-key') {
            operation.first = '';
            operation.op = '';
            operation.second = '';
            operation.current = 'first';
            operation.result = '';
        }else {
            if (operation.result !== '') {
                operation.result = operation.result.slice(0, operation.result.length - 1);
            } else {
                if (operation.second !== '') {
                    operation.second = operation.second.slice(0, operation.second.length - 1);
                }else if (operation.op !== '') {
                    operation.op = '';
                    operation.current = 'first';
                } else {
                    operation.first = operation.first.slice(0, operation.first.length - 1);
                }
            }
        }
    }
}


function DisplayUpdate() {
    let sup = document.querySelector('.sup');
    let inf = document.querySelector('.inf');

    let supText = operation.first;
    let infText = '';

    supText += (operation.op !== '') ? ` ${operation.op}` : '';
    supText += (operation.second !== '') ? ` ${operation.second}` : '';

    if (operation.result !== '') {
        infText = operation.result + '│';
    } else {
        supText += '│';
    }

    sup.innerText = supText;
    inf.innerText = infText;
}


document.addEventListener(
    'DOMContentLoaded',
    function () {
        Viewport();
        FontSize();
        ButtonsHover();
    }
);