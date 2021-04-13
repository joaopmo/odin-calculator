function Viewport() {
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);

    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        let vw = window.innerWidth * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}px`);
    });
}

function FontSize() {
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
            break;
        }

        item.style.fontSize = `${(9 * viewport) / normal}px`;
    });

    window.addEventListener('resize', () => {
        viewport = Math.min((window.innerHeight * 0.01), (window.innerWidth * 0.01));
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
                    break;
            }
            item.style.fontSize = `${(9 * viewport) / normal}px`;
        });
    });
}

function ButtonsHover() {
    let form = document.getElementById('buttons');

    form.addEventListener('pointerover', function (e) {
        let x = e.clientX;
        let y = e.clientY;
        let target = document.elementFromPoint(x, y);

        if ((target !== form) && (e.isPrimary)) {
            if (e.pointerType === 'mouse') {
                target.style.boxShadow = `1px 1px 3px 2px var(--${target.className}), 
                                  inset 0 0 60px 10px var(--${target.className}-alpha)`;
            }

            target.addEventListener('pointerout', function () {
                this.style.boxShadow = `1px 1px 3px 2px var(--${target.className})`;
                this.style.removeProperty('transform');
                this.style.textShadow = `1px 1px var(--${this.className})`;
            });
        }
    });

    form.addEventListener('pointerdown', function (e) {
        let x = e.clientX;
        let y = e.clientY;
        let target = document.elementFromPoint(x, y);

        if ((target !== form) && (e.isPrimary)) {

            target.style.boxShadow = `0 0 3px 2px var(--${target.className}), 
                                  inset 0 0 60px 10px var(--${target.className}-alpha)`;
            target.style.transform = 'translate(1px, 3px)';
            target.style.textShadow = `0 0 3px var(--${target.className})`;

            target.addEventListener('pointerup', function () {
                if (e.pointerType === 'mouse') {
                    this.style.boxShadow = `1px 1px 3px 2px var(--${target.className}), 
                                  inset 0 0 60px 10px var(--${target.className}-alpha)`;
                }
                this.style.removeProperty('transform');
                this.style.textShadow = `1px 1px var(--${this.className})`;
            });
        }
    });
}

let operation = {
    first: null,
    op: null,
    second: null,
    current: null,
    calc() {
      if (this.current === 3) {
          switch (this.op) {
              case 0:
                  return add(this.first, this.second);
              case 1:
                  return multiply(this.first, this.second);
              case 2:
                  return div(this.first, this.second);
              case  3:
                  return mod(this.first, this.second);
              case 4:
                  return power(this.first, this.second);
              default:
                  this.first = null;
                  this.op = null;
                  this.second = null;
                  this.current = null;
          }
      }
    },
};

function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

function div(a, b) {
    return a / b;
}

function mod(a, b) {
    return a % b;
}

function power(a, b) {
    return a ** b;
}


function operate(key) {
    if (operation.current === null || operation.current === 1) {
        operation.first = key;
        operation.current = 2;
    }else if (operation.current === 2) {
        operation.op = key;
        operation.current = 3;
    } else {
        operation.second = key;
        operation.current = 3;
    }
}


document.addEventListener(
    'DOMContentLoaded',
    function () {
        Viewport();
        FontSize();
        ButtonsHover();
    }
);