function Circles(id, pTop, pLeft, size) {
    let created = document.createElement('div')
    created.setAttribute('number', id)
    created.style.top = pTop - (size / 2) + 'px'
    created.style.left = pLeft - (size / 2)  + 'px'

    let animate = function () {
        created.animate([
            { top: `${pTop - (size / 2)}px`, left: `${pLeft - (size / 2)}px` },
            { top: `${pTop}px`, left: `${pLeft}px` }
        ], { duration: 1000, iterations: 1, delay: 350 })
    };

    let deleteDiv = function () {
        setTimeout(function () {
            created.remove()
        }, 1000)
    };

    this.draw = function () {
        document.body.append(created)
        animate()
        deleteDiv()
    }
}

// ####

let amount = 0
document.onmousemove = (event) => {
    amount++
    let d = new Circles(amount, event.clientY, event.clientX, getCircleSize())
    d.draw()
}

document.ontouchmove = (event) => {
    amount++
    var x = event.touches[0].clientX;
    var y = event.touches[0].clientY;
    let d = new Circles(amount, y, x, getCircleSize())
    d.draw()
  }

// ####

function getCircleSize(){
    let size = document.styleSheets[0].cssRules[0].style.getPropertyValue('--circles-size')
    return size.substring(0, size.length - 2)
}

// ####

function closeOpenDivs(exeption) {
    let OpenedDivs = document.querySelectorAll('div#float')
    OpenedDivs.forEach((d) => {
        if (d.hasAttribute('expanded') && !d.classList.contains(exeption)) {
            d.removeAttribute('expanded')
        }
    })
}

// ####

let settingsDiv = document.querySelector('div.settings')
function ToggleSettings() {
    closeOpenDivs()
    settingsDiv.toggleAttribute('expanded')
}

// ####

function TogglePropertySettings(element) {
    let div = document.querySelector(`.${element}#float`)
    closeOpenDivs(exeption = element)
    div.toggleAttribute('expanded')
}

// ####

function ChangeProperty(inp) {
    let propName = inp.getAttribute('for')
    document.styleSheets[0].cssRules[0].style.setProperty(`${propName}`, inp.hasAttribute('inPixels') ? inp.value + 'px' : inp.value);
    ChangePropertyText(propName, inp.value)
    setToLocatStorage(propName, inp.value)
}

// ####

function setToLocatStorage(prop, value) {
    if (!localStorage.getItem('properties')) {
        localStorage.setItem('properties', '{}')
    }

    let properties = JSON.parse(localStorage.getItem('properties'))
    properties[prop] = value

    localStorage.setItem('properties', JSON.stringify(properties))
}

// ####

function ChangePropertyText(propName, value) {
    let txt = document.querySelector(`p#${propName}`)
    if (txt) { txt.querySelector('span').innerHTML = value.trim() }
}


function setInputValue(forInp, value) {
    let inp = document.querySelector(`input[for=${forInp}]`)
    if (inp) {
        inp.value = value == 'transparent' ? value = '#000000' : value.trim()
    }
}

// ####

function setCssRootProperties(name, value) {
    let root = document.styleSheets[0].cssRules[0].style;
    if (name.endsWith("size")){value += 'px'}
    root.setProperty(name, value.trim());
}

// ####

let groups = {
    colors: ['--color-1', '--color-2', '--color-3'],
    shadows: ['--shadow-color-1', '--shadow-color-2', '--shadow-color-3']
}

function makeTransparent(groupName) {
    for (let i = 0; i < groups[groupName].length; i++) {
        const element = groups[groupName][i];
        setCssRootProperties(element, 'transparent')
        setInputValue(element, 'transparent')
        setToLocatStorage(element, 'transparent')
        ChangePropertyText(element, 'transparent')
    }
}

// ####

window.onload = () => {
    setToLocatStorage()
    let declaration = document.styleSheets[0].cssRules[0].style;
    let allFromStorage = JSON.parse(localStorage.getItem('properties'))
    for (e of declaration) {
        if (allFromStorage[e]) {
            ChangePropertyText(e, allFromStorage[e]);
            setInputValue(e, allFromStorage[e]);
            setCssRootProperties(e, allFromStorage[e]);
        } else {
            ChangePropertyText(e, declaration.getPropertyValue(e))
            setInputValue(e, declaration.getPropertyValue(e))
        }
    }
}