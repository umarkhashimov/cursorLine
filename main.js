
function Circles(id, pTop, pLeft){
    let created = document.createElement('div')
    created.setAttribute('number', id)
    created.style.top = pTop - 25 + 'px'
    created.style.left = pLeft - 25 + 'px'

    let animate = function(){
        created.animate([
            { top: `${pTop - 25}px`, left: `${pLeft - 25}px` },
            { top: `${pTop}px`, left: `${pLeft}px` }
        ], { duration: 1000, iterations: 1, delay: 350 })
    };

    let deleteDiv = function(){
        setTimeout(function(){
            created.remove()
        }, 1000)
    };

    this.draw = function(){
        document.body.append(created)
        animate()
        deleteDiv()
    }
}

// ####

let amount = 0
document.onmousemove = (event) => {
    amount++
    let d = new Circles(amount, event.clientY, event.clientX)
    d.draw()
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
    closeOpenDivs(exeption=element)
    div.toggleAttribute('expanded')
}

// ####

function ChangeProperty(inp) {
    let propName = inp.getAttribute('for')
    document.documentElement.style.setProperty(`${propName}`, inp.value);
    ChangePropertyText(propName, inp.value)
    setToLocatStorage(propName, inp.value)
}

// ####

function setToLocatStorage(prop, value){
    if (!localStorage.getItem('properties')){
        localStorage.setItem('properties', '{}')
    }

    let properties =  JSON.parse(localStorage.getItem('properties'))
    properties[prop] = value

    localStorage.setItem('properties', JSON.stringify(properties))
}

// ####

function ChangePropertyText(propName, value){
    let txt = document.querySelector(`p#${propName}`)
    if (txt){txt.querySelector('span').innerHTML = value}
}


function setInputValue(forInp, value){
    let inp = document.querySelector(`input[for=${forInp}]#pickers`)
    if(inp){inp.value = `${value.trim()}`}
}

// ####

window.onload = () => {
    setToLocatStorage()
    let declaration = document.styleSheets[0].cssRules[0].style;
    let allFromStorage = JSON.parse(localStorage.getItem('properties'))
    for (e of declaration){
        if (allFromStorage[e]){
            ChangePropertyText(e, allFromStorage[e])
            setInputValue(e, allFromStorage[e])
            declaration.setProperty(e, allFromStorage[e]);
        }else{
            ChangePropertyText(e, declaration.getPropertyValue(e))
            setInputValue(e, declaration.getPropertyValue(e))
        }
    }
}