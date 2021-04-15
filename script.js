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
            let scale = 0;
            switch (item.defaultValue.length) {
                case 1:
                    scale = 1;
                    break;
                case 2:
                    scale = 1.3;
                    break;
                case 3:
                    scale = 1.6;
            }
            item.style.fontSize = `${(9 * viewport) / scale}px`;
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
    TextCursor();

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
            operation.up = false;
            InputEventStyle(e, target);
            target.addEventListener('pointerup', function (event) {
                InputEventStyle(event, this);
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
    up: true,
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
            if (operation[operation.current].length >= 2 && operation[operation.current].length < 20) {
                operation[operation.current] += key.defaultValue;
            } else if (operation[operation.current].length === 1 && operation[operation.current][0] !== '-') {
                operation[operation.current] += key.defaultValue;
            }
        } else if (key.defaultValue !== '.' && operation[operation.current].length < 20) {
            operation[operation.current] += key.defaultValue;
        }
    } else if (key.className === 'operator' && (operation[operation.current].length >= 2 ||
                operation[operation.current].length !== 0 && operation[operation.current][0] !== '-')) {
        if (operation.result !== '') {
            operation.first = operation.result;
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
                let isNum = operation.result.slice(0, operation.result.length - 1);
                if (isFinite(Number(isNum)) && isNum !== '') {
                    operation.result = isNum;
                } else {
                    operation.result = '';
                    operation.current = 'second';
                }
            } else {
                if (operation.second !== '') {
                    let isNum = operation.second.slice(0, operation.second.length - 1);
                    if (isFinite(Number(isNum))) {
                        operation.second = isNum;
                    } else {
                        operation.second = '';
                    }
                }else if (operation.op !== '') {
                    operation.op = '';
                    operation.current = 'first';
                } else {
                    let isNum = operation.first.slice(0, operation.first.length - 1);
                    if (isFinite(Number(isNum))) {
                        operation.first = isNum;
                    } else {
                        operation.first = '';
                    }
                }
            }
        }
    }
}


function TextCursor() {
    let sup = document.querySelector('.sup');
    let inf = document.querySelector('.inf');

    sup.querySelector('.cursor').innerText = '│';

    let cursor = true;
    setInterval(() => {
        if(cursor && operation.up) {
            sup.querySelector('.cursor').classList.add('hidden');
            inf.querySelector('.cursor').classList.add('hidden');
            inf.querySelector('.cursor').innerText = '│';
            cursor = false;
        }else {
            if (operation.result !== ''){
                sup.querySelector('.cursor').classList.add('hidden');
                inf.querySelector('.cursor').classList.remove('hidden');
            } else {
                sup.querySelector('.cursor').classList.remove('hidden');
                inf.querySelector('.cursor').classList.add('hidden');
            }
            cursor = true;
            operation.up = true
        }


        if (sup.querySelector('.second').innerHTML !== '') {
            sup.querySelector('.cursor').style.gridArea = '2/3/3/4';
        } else if (sup.querySelector('.op').innerHTML === '') {
            sup.querySelector('.cursor').style.gridArea = '1/3/2/4';
        }

    }, 500);
}


function DisplayUpdate() {
    let sup = document.querySelector('.sup');
    let inf = document.querySelector('.inf');

    sup.querySelector('.op').innerText = operation.op;
    sup.querySelector('.first').innerHTML = operation.first;
    sup.querySelector('.second').innerHTML = operation.second;
    inf.querySelector('.first').innerText = operation.result;

}


document.addEventListener(
    'DOMContentLoaded',
    function () {
        Viewport();
        FontSize();
        ButtonsHover();
    }
);