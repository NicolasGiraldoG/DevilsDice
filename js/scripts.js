let gameRound = 1;
let specialH = false;
let specialD = false;
let cordice = 0;
let vdice = false;
let vdiceA = [false, false, false];
let vdiceB = [false, false, false]
let fdice = false;
let fdiceA = [false, false, false];
let fdiceB = [false, false, false];
let checkStartA = false
let checkStartB = false
let statCheckStartA = true
let statCheckStartB = true
let readyForCleanse
let CleanseFirstCheck = true
let turn = "a"; //Define el turno de los jugadores
let rollD = 0; //Guarda la tirada de un dado
let playerA = 0; //guarda la tirada del jugador a para el orden de inicio
let playerB = 0; //guarda la tirada del jugador b para el orden de inicio
let dicesA = ["", "", ""]; //juarda los objetos de los dados del jugador a
let dicesB = ["", "", ""]; //juarda los objetos de los dados del jugador b
let assignPhaseDice = 0; // contador de iteraciones de acciones por jugador la fase de asignacion I y II
let assignPhaseturn = 1; // contador de iteraciones de turnos de la fase de asignacion I y II
let typeAPhIa = []; // guarda el tipo de dado para pasarlo como argumento al contructor de objetos de dados para el jugador a
let diceAPhIa = []; // guarda el nombre dado para pasarlo como argumento al contructor de objetos de dados para el jugador a
let typeAPhIb = []; // guarda el tipo de dado para pasarlo como argumento al contructor de objetos de dados para el jugador b
let diceAPhIb = []; // guarda el nombre dado para pasarlo como argumento al contructor de objetos de dados para el jugador b
let throwsAPhII = [0]; //guarda las tiradas en la fase de recogida de dados para que no se repia el dado seleccionado al empezar la partida.
let diceTrayA = [0, 0, 0, 1, 1, 1];
let diceTrayB = [0, 0, 0, 1, 1, 1];
let attdef = [0, 0];
let gameTimerPause = 0;
let checkPhaseCounter = 0;

function Speed(number) {
    gameTimerPause = number
    console.log("Phase change and message show speed changed to: ", gameTimerPause, "ms")
}
function CreateDice(dice, type) { //constructor de objetos de dados
    if (!(this instanceof CreateDice)) {
        return new CreateDice(dice, type);
    }
    switch (dice) {
        case "d4":
            this.name = "d4";
            this.maxHp = type == "a" ? 10 : 20;
            this.currentHP = type == "a" ? 10 : 20;
            this.adice = "d20";
            this.hdice = 18;
            this.ddice = "d4";
            this.status = "Normal"
            this.statusTurn = 0
            this.statusCleanse = 2
            this.attack = true
            this.defense = true
            this.special = function () {
                //roll d6*md4 gratis a un oponente aleatorio
            }
            this.slotIndex = 0
            break;
        case "d6":
            this.name = "d6";
            this.maxHp = type == "a" ? 30 : 40;
            this.currentHP = type == "a" ? 30 : 40;
            this.adice = "d12";
            this.hdice = 10 //>
            this.ddice = "d6";
            this.status = "Normal"
            this.statusTurn = 0
            this.statusCleanse = 3
            this.attack = true
            this.defense = true
            this.special = function () {
                //roll corD
            }
            this.slotIndex = 0
            break;
        case "d8":
            this.name = "d8";
            this.maxHp = type == "a" ? 50 : 60;
            this.currentHP = type == "a" ? 50 : 60;
            this.adice = "d8";
            this.hdice = 4 //<
            this.ddice = "d8";
            this.status = "Normal"
            this.statusTurn = 0
            this.statusCleanse = 4
            this.attack = true
            this.defense = true
            this.special = function () {
                //roll d8* md6 en vez de md4
            }
            this.slotIndex = 0
            break;
        case "d12":
            this.name = "d12";
            this.maxHp = type == "a" ? 70 : 80;
            this.currentHP = type == "a" ? 70 : 80;
            this.adice = "d6";
            this.hdice = 10 //> Ddefensa
            this.ddice = "d12";
            this.status = "Normal"
            this.statusTurn = 0
            this.statusCleanse = 6
            this.attack = true
            this.defense = true
            this.special = function () {
                //roll Cd4
            }
            this.slotIndex = 0
            break;
        case "d20":
            this.name = "d20";
            this.maxHp = type == "a" ? 90 : 100;
            this.currentHP = type == "a" ? 90 : 100;
            this.adice = "d4";
            this.hdice = 999 //Pasiva 
            this.ddice = "d20";
            this.status = "Normal"
            this.statusTurn = 0
            this.statusCleanse = 10
            this.attack = true
            this.defense = true
            this.special = function () {
                //roll d20 * d4 para defensa si hp <= 30% (sin espinas, a menos que los 3 dados en juego sean d20 o que el ultimo dado en juego sea este)
            }
            this.slotIndex = 0
            break;
    }
}

function NextTurn() {
    turn = turn == "a" ? "b" : "a"
}

function Roll(dice) {
    switch (dice) {
        case "d4":
            rollD = Math.ceil(Math.random() * 4);
            break;
        case "d6":
            rollD = Math.ceil(Math.random() * 6);
            break;
        case "d8":
            rollD = Math.ceil(Math.random() * 8);
            break;
        case "dT10": //dado de prcentaje de 10 en 10
            rollD = (Math.ceil(Math.random() * 10) * 10);
            break;
        case "d12":
            rollD = Math.ceil(Math.random() * 12);
            break;
        case "d20":
            rollD = Math.ceil(Math.random() * 20);
            break;
    }

    console.log(rollD);
}

function waitButton(botonId, callback) { //funcion para esperar el input de un boton antes de seguir con el codigo 
    let boton = document.getElementById(botonId);
    boton.onclick = function () {
        callback(); // Llama a la función cuando el usuario haga clic
    };
}

function WaitButtons(buttonActions, callback) { // funcion para esperar el input de cualquiera de los 3 botones de ataque/defensa y llama una funcion adicional para continuar el flujo
    Object.entries(buttonActions).forEach(([botonId, action]) => {
        let boton = document.getElementById(botonId);
        boton.style.cursor = "pointer";
        if (boton) {
            boton.onclick = function () {
                action(); // Ejecuta la función específica de este botón
                callback(botonId); // Llama a la función de continuación del flujo
            };
        } else {
            console.warn(`Elemento con ID "${botonId}" no encontrado.`);
        }
    });
}

function DisableTrayButtons(buttonActions) {
    Object.keys(buttonActions).forEach(botonId => {
        const boton = document.getElementById(botonId);
        if (boton) {
            boton.onclick = null; // Deshabilita el evento onclick
        }
    });
}

function innerHTMLFormat(elementId, innerHTML) { //formateador dinamico de innerHTML
    let element = document.getElementById(elementId);
    element.innerHTML = innerHTML;
}

function ChangeTextColor(elementId, textColor, shadowYN, ...shadowColorsArr){
    let element = document.getElementById(elementId);
    element.style.transition = "all 0.5s ease-in-out"
    element.style.color = textColor
    console.log(shadowColorsArr)
    if (shadowYN === "yes") {
        console.log ("shadow applied")
        element.style.textShadow = `1px 1px 2px ${shadowColorsArr[0]}, 0 0 1em ${shadowColorsArr[1]}, 0 0 0.2em ${shadowColorsArr[0]}`
    } else {
        console.log ("shadow not applied / removed")
        element.style.textShadow = "none"
    }
}

function ToggleButton(buttonId, boolean) { //boolean string "on" || "off" //switch dinamico para habilitar botones
    let button = document.getElementById(buttonId);
    switch (boolean) {
        case "on":
            button.disabled = false;
            console.log(buttonId, "Toggled ", boolean)
            break;
        case "off":
            button.disabled = true;
            console.log(buttonId, "Toggled ", boolean)
            break;
    }
}

function ToggleGridElement(elementId, boolean) { //boolean string "on" || "off" //switch dinamico para mostrar o esconder elementos grid
    let element = document.getElementById(elementId);
    switch (boolean) {
        case "on":
            element.style.display = "grid";
            break;
        case "off":
            element.style.display = "none";
            break;
    }
}

function GetType(dice) { // da el tipo del dado en la fase de asignacion
    if (((dice / 10) % 2) == 0) {
        return "b";
    } else {
        return "a";
    }
}

function GetDiceTens(result) { // da el nombre del dado en la fase de asignacion
    if (result <= 20) {
        return "d4"
    } else if (result >= 21 && result <= 40) {
        return "d6"
    } else if (result >= 41 && result <= 60) {
        return "d8"
    } else if (result >= 61 && result <= 80) {
        return "d12"
    } else {
        return "d20"
    }
}

function AssignAD(turn) {
    if (turn == "a") {
        let emptySlot = diceTrayA.indexOf(0);
        diceTrayA[emptySlot] = "aD"
        innerHTMLFormat(`dt-a-${((emptySlot + 1))}`, "aD");
    } else {
        let emptySlot = diceTrayB.indexOf(0);
        diceTrayB[emptySlot] = "aD"
        innerHTMLFormat(`dt-b-${((emptySlot + 1))}`, "aD");
    }
}

function AssignMaD(turn) {
    if (turn == "a") {
        let emptySlot = diceTrayA.indexOf(0);
        diceTrayA[emptySlot] = "MaD"
        innerHTMLFormat(`dt-a-${(emptySlot + 1)}`, "MaD");
    } else {
        let emptySlot = diceTrayB.indexOf(0);
        diceTrayB[emptySlot] = "MaD"
        innerHTMLFormat(`dt-b-${((emptySlot + 1))}`, "MaD");
    }
}

function AssignCD(turn) {
    if (turn == "a") {
        let emptySlot = diceTrayA.indexOf(1);
        if (emptySlot != -1) {
            diceTrayA[emptySlot] = "cD"
            innerHTMLFormat(`dt-a-${((emptySlot + 1))}`, "cD");
        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
    } else {
        let emptySlot = diceTrayB.indexOf(1);
        if (emptySlot != -1) {

        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
        diceTrayB[emptySlot] = "cD"
        innerHTMLFormat(`dt-b-${((emptySlot + 1))}`, "cD");
    }
}

function AssignCorD(turn) {
    if (turn == "a") {
        let emptySlot = diceTrayA.indexOf(1);
        if (emptySlot != -1) {
            diceTrayA[emptySlot] = "corD"
            innerHTMLFormat(`dt-a-${((emptySlot + 1))}`, "corD");
        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
    } else {
        let emptySlot = diceTrayB.indexOf(1);
        if (emptySlot != -1) {
            diceTrayB[emptySlot] = "corD"
            innerHTMLFormat(`dt-b-${((emptySlot + 1))}`, "corD");
        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
    }
}

function AssignVD(turn) {
    if (turn == "a") {
        let emptySlot = diceTrayA.indexOf(1);
        if (emptySlot != -1) {
            diceTrayA[emptySlot] = "vD"
            innerHTMLFormat(`dt-a-${((emptySlot + 1))}`, "vD");
        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
    } else {
        let emptySlot = diceTrayB.indexOf(1);
        if (emptySlot != -1) {
            diceTrayB[emptySlot] = "vD"
            innerHTMLFormat(`dt-b-${((emptySlot + 1))}`, "vD");
        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
    }
}

function AssignMcD(turn) {
    if (turn == "a") {
        let emptySlot = diceTrayA.indexOf(1);
        if (emptySlot != -1) {
            diceTrayA[emptySlot] = "McD"
            innerHTMLFormat(`dt-a-${((emptySlot + 1))}`, "McD");
        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
    } else {
        let emptySlot = diceTrayB.indexOf(1);
        if (emptySlot != -1) {
            diceTrayB[emptySlot] = "McD"
            innerHTMLFormat(`dt-b-${((emptySlot + 1))}`, "McD");
        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
    }
}

function AssignMCorD(turn) {
    if (turn == "a") {
        let emptySlot = diceTrayA.indexOf(1);
        if (emptySlot != -1) {
            diceTrayA[emptySlot] = "McorD"
            innerHTMLFormat(`dt-a-${((emptySlot + 1))}`, "McorD");
        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
    } else {
        let emptySlot = diceTrayB.indexOf(1);
        if (emptySlot != -1) {
            diceTrayB[emptySlot] = "McorD"
            innerHTMLFormat(`dt-b-${((emptySlot + 1))}`, "McorD");
        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
    }
}

function AssignFD(turn) {
    if (turn == "a") {
        let emptySlot = diceTrayA.indexOf(1);
        if (emptySlot != -1) {
            diceTrayA[emptySlot] = "fD"
            innerHTMLFormat(`dt-a-${((emptySlot + 1))}`, "fD");
        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
    } else {
        let emptySlot = diceTrayB.indexOf(1);
        if (emptySlot != -1) {
            diceTrayB[emptySlot] = "fD"
            innerHTMLFormat(`dt-b-${((emptySlot + 1))}`, "fD");
        } else {
            innerHTMLFormat(`alert-${turn}`, "Special Dice Tray Full!!")
        }
    }
}

function DrawAttDice() {
    Roll("d12");
    innerHTMLFormat("alert-gs", rollD)
    if (rollD < 6) {
        AssignAD(turn)
    } else if (rollD >= 6) {
        AssignMaD(turn)
        switch (rollD) {
            case 7:
                AssignCD(turn)
                break;
            case 8:
                AssignCorD(turn)
                break;
            case 9:
                AssignVD(turn)
                break;
            case 10:
                AssignMcD(turn)
                break;
            case 11:
                AssignMCorD(turn)
                break;
            case 12:
                AssignFD(turn)
                break;
        }
    }
}

function AssignTrayActions() {
    let diceD = document.getElementById("dice-d")
    let diceS = document.getElementById("dice-s");
    if (turn == "a") {
        let adices = {
            "dt-a-1": () => {
                if (diceTrayA[0] != 0) {
                    if (diceD.innerHTML != "") {
                        let toTray = diceD.innerHTML
                        innerHTMLFormat("dice-d", diceTrayA[0])
                        innerHTMLFormat("dt-a-1", toTray)
                        diceTrayA[0] = toTray
                    } else {
                        innerHTMLFormat("dice-d", diceTrayA[0])
                        innerHTMLFormat("dt-a-1", "")
                        diceTrayA[0] = 0
                    }
                }

            },
            "dt-a-2": () => {
                if (diceTrayA[1] != 0) {
                    if (diceD.innerHTML != "") {
                        let toTray = diceD.innerHTML
                        innerHTMLFormat("dice-d", diceTrayA[1])
                        innerHTMLFormat("dt-a-2", toTray)
                        diceTrayA[1] = toTray
                    } else {
                        innerHTMLFormat("dice-d", diceTrayA[1])
                        innerHTMLFormat("dt-a-2", "")
                        diceTrayA[1] = 0
                    }
                }

            },
            "dt-a-3": () => {
                if (diceTrayA[2] != 0) {
                    if (diceD.innerHTML != "") {
                        let toTray = diceD.innerHTML
                        innerHTMLFormat("dice-d", diceTrayA[2])
                        innerHTMLFormat("dt-a-3", toTray)
                        diceTrayA[2] = toTray
                    } else {
                        innerHTMLFormat("dice-d", diceTrayA[2])
                        innerHTMLFormat("dt-a-3", "")
                        diceTrayA[2] = 0
                    }
                }

            },
            "dt-a-4": () => {
                if (diceTrayA[3] != 1) {
                    if (diceS.innerHTML != "") {
                        let toTray = diceS.innerHTML
                        innerHTMLFormat("dice-s", diceTrayA[3])
                        innerHTMLFormat("dt-a-4", toTray)
                        diceTrayA[3] = toTray
                    } else {
                        innerHTMLFormat("dice-s", diceTrayA[3])
                        innerHTMLFormat("dt-a-4", "")
                        diceTrayA[3] = 1
                    }
                }
            },
            "dt-a-5": () => {
                if (diceTrayA[4] != 1) {
                    if (diceS.innerHTML != "") {
                        let toTray = diceS.innerHTML
                        innerHTMLFormat("dice-s", diceTrayA[4])
                        innerHTMLFormat("dt-a-5", toTray)
                        diceTrayA[4] = toTray
                    } else {
                        innerHTMLFormat("dice-s", diceTrayA[4])
                        innerHTMLFormat("dt-a-5", "")
                        diceTrayA[4] = 1
                    }
                }
            },
            "dt-a-6": () => {
                if (diceTrayA[5] != 1) {
                    if (diceS.innerHTML != "") {
                        let toTray = diceS.innerHTML
                        innerHTMLFormat("dice-s", diceTrayA[5])
                        innerHTMLFormat("dt-a-6", toTray)
                        diceTrayA[5] = toTray
                    } else {
                        innerHTMLFormat("dice-s", diceTrayA[5])
                        innerHTMLFormat("dt-a-6", "")
                        diceTrayA[5] = 1
                    }
                }
            }
        }
        return adices;
    } else {
        let bdices = {
            "dt-b-1": () => {
                if (diceTrayB[0] != 0) {
                    if (diceD.innerHTML != "") {
                        let toTray = diceD.innerHTML
                        innerHTMLFormat("dice-d", diceTrayB[0])
                        innerHTMLFormat("dt-b-1", toTray)
                        diceTrayB[0] = toTray
                    } else {
                        innerHTMLFormat("dice-d", diceTrayB[0])
                        innerHTMLFormat("dt-b-1", "")
                        diceTrayB[0] = 0
                    }
                }
            },
            "dt-b-2": () => {
                if (diceTrayB[1] != 0) {
                    if (diceD.innerHTML != "") {
                        let toTray = diceD.innerHTML
                        innerHTMLFormat("dice-d", diceTrayB[1])
                        innerHTMLFormat("dt-b-2", toTray)
                        diceTrayB[1] = toTray
                    } else {
                        innerHTMLFormat("dice-d", diceTrayB[1])
                        innerHTMLFormat("dt-b-2", "")
                        diceTrayB[1] = 0
                    }
                }
            },
            "dt-b-3": () => {
                if (diceTrayB[2] != 0) {
                    if (diceD.innerHTML != "") {
                        let toTray = diceD.innerHTML
                        innerHTMLFormat("dice-d", diceTrayB[2])
                        innerHTMLFormat("dt-b-3", toTray)
                        diceTrayB[2] = toTray
                    } else {
                        innerHTMLFormat("dice-d", diceTrayB[2])
                        innerHTMLFormat("dt-b-3", "")
                        diceTrayB[2] = 0
                    }
                }
            },
            "dt-b-4": () => {
                if (diceTrayB[3] != 1) {
                    if (diceS.innerHTML != "") {
                        let toTray = diceS.innerHTML
                        innerHTMLFormat("dice-s", diceTrayB[3])
                        innerHTMLFormat("dt-b-4", toTray)
                        diceTrayB[3] = toTray
                    } else {
                        innerHTMLFormat("dice-s", diceTrayB[3])
                        innerHTMLFormat("dt-b-4", "")
                        diceTrayB[3] = 1
                    }
                }
            },
            "dt-b-5": () => {
                if (diceTrayB[4] != 1) {
                    if (diceS.innerHTML != "") {
                        let toTray = diceS.innerHTML
                        innerHTMLFormat("dice-s", diceTrayB[4])
                        innerHTMLFormat("dt-b-5", toTray)
                        diceTrayB[4] = toTray
                    } else {
                        innerHTMLFormat("dice-s", diceTrayB[4])
                        innerHTMLFormat("dt-b-5", "")
                        diceTrayB[4] = 1
                    }
                }
            },
            "dt-b-6": () => {
                if (diceTrayB[5] != 1) {
                    if (diceS.innerHTML != "") {
                        let toTray = diceS.innerHTML
                        innerHTMLFormat("dice-s", diceTrayB[5])
                        innerHTMLFormat("dt-b-6", toTray)
                        diceTrayB[5] = toTray
                    } else {
                        innerHTMLFormat("dice-s", diceTrayB[5])
                        innerHTMLFormat("dt-b-6", "")
                        diceTrayB[5] = 1
                    }
                }
            }
        }
        return bdices;
    }
}

function CalculateAttack(diceArrayIndex, attackDice, spDice) {

    if (turn == "a") {
        Roll(dicesA[diceArrayIndex].adice)
        innerHTMLFormat("dice-d", rollD)
        attdef[0] = rollD
        if (rollD >= dicesA[0].hdice) {
            specialH = true
        }
        if (attackDice == "MaD") {
            Roll("d4")
            innerHTMLFormat("dice-m", rollD)
            attdef[0] *= rollD
        }
        innerHTMLFormat("dice-total", attdef[0])
        if (spDice != "") {
            specialD = true
        }
    } else {
        Roll(dicesB[diceArrayIndex].adice)
        innerHTMLFormat("dice-d", rollD)
        attdef[0] = rollD
        if (rollD >= dicesB[0].hdice) {
            specialH = true
        }
        if (attackDice == "MaD") {
            Roll("d4")
            innerHTMLFormat("dice-m", rollD)
            attdef[0] *= rollD
        }
        innerHTMLFormat("dice-total", attdef[0])
        if (spDice != "") {
            specialD = true
        }
    }
}

async function HpAnimation(Hp, damageType, UiElement, diceCurrentHP, diceMaxHP) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let element = document.getElementById(UiElement)
            let pElement = element.parentElement
            pElement.parentElement.style.position = "relative"
            let color = pElement.parentElement.style.borderColor
            let defaultTime
            let MultiTime
            let brake = 1
            let FloatingDamageHeal
            element.style.transition = "all 0.3s ease-in-out"
            pElement.parentElement.style.transition = "all 0.8s ease-in-out"
            element.style.transform = "scale(1.5)"
            FloatingDamageHeal = document.createElement("div")
            pElement.parentElement.appendChild(FloatingDamageHeal)
            FloatingDamageHeal.style.position = "absolute"
            FloatingDamageHeal.style.color = "rgba(0, 0, 0, 0)"
            FloatingDamageHeal.style.width = "100%"
            FloatingDamageHeal.style.height = "100%"
            FloatingDamageHeal.style.top = "45%";
            FloatingDamageHeal.style.left = "0%";
            FloatingDamageHeal.style.transform = "translate(-50%, -50%)";
            FloatingDamageHeal.style.transform = "scale(2)"
            FloatingDamageHeal.style.transition = "all 0.3s ease-in-out"
            FloatingDamageHeal.style.textAlign = "center"
            FloatingDamageHeal.style.fontSize = "24px"
            FloatingDamageHeal.style.webkitTextStrokeColor = "black"
            FloatingDamageHeal.style.webkitTextStrokeWidth = "1px"
            FloatingDamageHeal.innerHTML = Hp
            setTimeout(() => {
                FloatingDamageHeal.style.transform = "scale(1)"
            }, 50);
            switch (damageType) {
                case "Normal":
                    FloatingDamageHeal.style.color = "red"
                    element.style.color = "maroon"
                    element.style.textShadow = "1px 1px 2px crimson, 0 0 0.5em red, 0 0 0.2em crimson"
                    pElement.parentElement.style.borderColor = "red";
                    pElement.parentElement.style.transform = "scale(1.1)"
                    defaultTime = 200
                    MultiTime = Math.max(50, 200 - (Hp * 20));
                    break;
                case "Venom":
                    FloatingDamageHeal.style.color = "purple"
                    element.style.color = "magenta"
                    element.style.textShadow = "1px 1px 2px darkviolet, 0 0 0.5em purple, 0 0 0.2em darkviolet"
                    pElement.parentElement.style.borderColor = "purple";
                    pElement.parentElement.style.transform = "scale(1.1)"
                    defaultTime = 300
                    MultiTime = Math.max(50, 250 - (Hp * 25));
                    break;
                case "Fire":
                    FloatingDamageHeal.style.color = "brown"
                    element.style.color = "black"
                    element.style.textShadow = "1px 1px 2px sienna, 0 0 0.5em saddlebrown, 0 0 0.2em brown"
                    pElement.parentElement.style.borderColor = "brown";
                    pElement.parentElement.style.transform = "scale(1.1)"
                    defaultTime = 300
                    MultiTime = Math.max(50, 250 - (Hp * 25));
                    break;
                case "Heal":
                    FloatingDamageHeal.style.color = "green"
                    element.style.color = "limegreen"
                    element.style.textShadow = "1px 1px 2px limegreen, 0 0 1em green, 0 0 0.2em limegreen"
                    pElement.parentElement.style.borderColor = "green";
                    pElement.parentElement.style.transform = "scale(1.1)"
                    defaultTime = 200
                    MultiTime = Math.max(50, 250 - (Hp * 20));
                    break;
            }
            for (let i = 0; i <= Hp; i++) {
                ((i) => {
                    setTimeout(() => {
                        if (damageType == "Heal") {
                            innerHTMLFormat(UiElement, diceCurrentHP + i);
                            if (diceCurrentHP + i >= diceMaxHP) {
                                innerHTMLFormat(UiElement, diceMaxHP);
                                brake = 0
                            }
                        } else {
                            innerHTMLFormat(UiElement, diceCurrentHP - i);
                            if (diceCurrentHP - i < 0) {
                                innerHTMLFormat(UiElement, 0);
                                brake = 0
                            }
                        }
                    }, (defaultTime + (i * MultiTime))) * brake;
                })(i);
            }
            setTimeout(() => {
                element.style.transform = "scale(1)"
                pElement.parentElement.style.transform = "scale(1)"
                let hpPercent = damageType == "Heal" ? (((Math.min(diceMaxHP, (diceCurrentHP + Hp))) / diceMaxHP) * 100) : (((Math.max(1, (diceCurrentHP - Hp))) / diceMaxHP) * 100)
                if (hpPercent > 50) {
                    console.log(hpPercent, ">50")
                    element.style.color = "#043f32"
                    element.style.textShadow = "1px 1px 2px limegreen, 0 0 1em green, 0 0 0.2em limegreen"
                } else if (hpPercent > 25 && hpPercent <= 50){
                    console.log(hpPercent, ">25 <=50")
                    element.style.color = "orangered"
                    element.style.textShadow = "1px 1px 2px chocolate, 0 0 1em orange, 0 0 0.2em chocolate"
                } else if (hpPercent <= 25){
                    console.log(hpPercent, "<= 25")
                    element.style.color = "darkred"
                    element.style.textShadow = "1px 1px 2px crimson, 0 0 1em red, 0 0 0.2em crimson"
                }
                pElement.parentElement.style.borderColor = color;
                FloatingDamageHeal.style.transition = "all 1s ease-in-out"
                FloatingDamageHeal.style.color = "rgba(0, 0, 0, 0)"
                FloatingDamageHeal.style.webkitTextStrokeColor = "rgba(0, 0, 0, 0)"
                setTimeout(() => {
                    FloatingDamageHeal.remove()
                }, 1200);
                resolve();
            }, (defaultTime + (Hp * MultiTime)) * brake);
        }, gameTimerPause);
    });
}

function AssignChooseDiceActionsAttack() {
    let diceD = document.getElementById("dice-d")
    let diceS = document.getElementById("dice-s");
    let diceT = document.getElementById("dice-total");
    if (turn == "a") {
        let adices = {
            "select-dice-btn-a-1": () => {
                if (diceD.innerHTML == "") {
                    innerHTMLFormat(`alert-${turn}`, "Please select an attack dice")
                } else {
                    CalculateAttack(0, diceD.innerHTML, diceS.innerHTML)
                    dicesA[0].attack = false
                    dicesA[1].attack = true
                    dicesA[2].attack = true
                }
            },
            "select-dice-btn-a-2": () => {
                if (diceD.innerHTML == "") {
                    innerHTMLFormat(`alert-${turn}`, "Please select an attack dice")
                } else {
                    CalculateAttack(1, diceD.innerHTML, diceS.innerHTML)
                    dicesA[0].attack = true
                    dicesA[1].attack = false
                    dicesA[2].attack = true
                }
            },
            "select-dice-btn-a-3": () => {
                if (diceD.innerHTML == "") {
                    innerHTMLFormat(`alert-${turn}`, "Please select an attack dice")
                } else {
                    CalculateAttack(2, diceD.innerHTML, diceS.innerHTML)
                    dicesA[0].attack = true
                    dicesA[1].attack = true
                    dicesA[2].attack = false
                }
            }
        }
        return adices
    } else {
        let bdices = {
            "select-dice-btn-b-1": () => {
                if (diceD.innerHTML == "") {
                    innerHTMLFormat(`alert-${turn}`, "Please select an attack dice")
                } else {
                    CalculateAttack(0, diceD.innerHTML, diceS.innerHTML)
                    dicesB[0].attack = false
                    dicesB[1].attack = true
                    dicesB[2].attack = true
                }
            },
            "select-dice-btn-b-2": () => {
                if (diceD.innerHTML == "") {
                    innerHTMLFormat(`alert-${turn}`, "Please select an attack dice")
                } else {
                    CalculateAttack(1, diceD.innerHTML, diceS.innerHTML)
                    dicesB[0].attack = true
                    dicesB[1].attack = false
                    dicesB[2].attack = true
                }
            },
            "select-dice-btn-b-3": () => {
                if (diceD.innerHTML == "") {
                    innerHTMLFormat(`alert-${turn}`, "Please select an attack dice")
                } else {
                    CalculateAttack(2, diceD.innerHTML, diceS.innerHTML)
                    dicesB[0].attack = true
                    dicesB[1].attack = true
                    dicesB[2].attack = false
                }
            }
        }
        return bdices
    }
}

function GetSpecialDnumber() {
    let dice = document.getElementById("dice-s").innerHTML
    switch (dice) {
        case "cD":
            return "d6"
            break;
        case "corD":
            return "d6"
            break;
        case "vD":
            return "d4"
            break;
        case "McD":
            return "d6 x d4"
            break;
        case "McorD":
            return "d6 x d4"
            break;
        case "fD":
            return "d4"
            break;
    }
}

function RollSpecialDice() {
    let dice = document.getElementById("dice-s").innerHTML
    switch (dice) {
        case "cD":
            Roll("d6");
            let heal = rollD;
            let diceCD;
            innerHTMLFormat("dice-s", `cD(${rollD})`)
            innerHTMLFormat(`alert-${turn}`, `Select a dice to heal ${heal}`)
            ToggleAllButtons(`${turn}`, "on")
            ToggleButton(`select-dice-btn-${turn}-4`, "off")
            if (turn == "a") {
                diceCD = {
                    "select-dice-btn-a-1": async () => {
                        await HpAnimation(heal, "Heal", "current-hp-1-a", dicesA[0].currentHP, dicesA[0].maxHp)
                        dicesA[0].currentHP = (Math.min(dicesA[0].maxHp, dicesA[0].currentHP + heal));
                        //innerHTMLFormat("current-hp-1-a", dicesA[0].currentHP);
                        innerHTMLFormat(`select-dice-btn-a-4`, "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    },
                    "select-dice-btn-a-2": async () => {
                        await HpAnimation(heal, "Heal", "current-hp-2-a", dicesA[1].currentHP, dicesA[1].maxHp)
                        dicesA[1].currentHP = (Math.min(dicesA[1].maxHp, dicesA[1].currentHP + heal));
                        //innerHTMLFormat("current-hp-2-a", dicesA[1].currentHP);
                        innerHTMLFormat("select-dice-btn-a-4", "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    },
                    "select-dice-btn-a-3": async () => {
                        await HpAnimation(heal, "Heal", "current-hp-3-a", dicesA[2].currentHP, dicesA[2].maxHp)
                        dicesA[2].currentHP = (Math.min(dicesA[2].maxHp, dicesA[2].currentHP + heal));
                        //innerHTMLFormat("current-hp-3-a", dicesA[2].currentHP);
                        innerHTMLFormat("select-dice-btn-a-4", "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    }
                }
            } else {
                ToggleAllButtons(`${turn}`, "on");
                diceCD = {
                    "select-dice-btn-b-1": async () => {
                        await HpAnimation(heal, "Heal", "current-hp-1-b", dicesB[0].currentHP, dicesB[0].maxHp)
                        dicesB[0].currentHP = (Math.min(dicesB[0].maxHp, dicesB[0].currentHP + heal));
                        //innerHTMLFormat("current-hp-1-b", dicesB[0].currentHP);
                        innerHTMLFormat("select-dice-btn-b-4", "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    },
                    "select-dice-btn-b-2": async () => {
                        await HpAnimation(heal, "Heal", "current-hp-2-b", dicesB[1].currentHP, dicesB[1].maxHp)
                        dicesB[1].currentHP = (Math.min(dicesB[1].maxHp, dicesB[1].currentHP + heal));
                        //innerHTMLFormat("current-hp-2-b", dicesB[1].currentHP);
                        innerHTMLFormat("select-dice-btn-b-4", "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    },
                    "select-dice-btn-b-3": async () => {
                        await HpAnimation(heal, "Heal", "current-hp-3-b", dicesB[2].currentHP, dicesB[2].maxHp)
                        dicesB[2].currentHP = (Math.min(dicesB[2].maxHp, dicesB[2].currentHP + heal));
                        //innerHTMLFormat("current-hp-3-b", dicesB[2].currentHP);
                        innerHTMLFormat("select-dice-btn-b-4", "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    }
                }
            }
            WaitButtons(diceCD, () => {
                DisableTrayButtons(diceCD);
            })
            break;
        case "corD":
            Roll("d6");
            innerHTMLFormat("dice-s", `corD(${rollD})`)
            cordice = rollD
            innerHTMLFormat(`select-dice-btn-${turn}-4`, "Attack");
            break;
        case "vD":
            Roll("d4");
            innerHTMLFormat("dice-s", `vD(${rollD})`)
            if (rollD == 1) {
                innerHTMLFormat(`alert-${turn}`, "Dice effect fails!")
            } else {
                innerHTMLFormat(`alert-${turn}`, "Venom effect activated!")
                vdice = true;
            }
            innerHTMLFormat(`select-dice-btn-${turn}-4`, "Attack");
            break;
        case "McD":
            Roll("d6");
            let healM = rollD;
            Roll("d4");
            let diceMcD;
            innerHTMLFormat("dice-s", `McD(${healM} * ${rollD}) (${healM * rollD})`)
            healM *= rollD
            innerHTMLFormat(`alert-${turn}`, `Select a dice to heal ${healM}`)
            ToggleButton(`select-dice-btn-${turn}-4`, "off")
            if (turn == "a") {
                ToggleAllButtons("a", "on");
                diceMcD = {
                    "select-dice-btn-a-1": async () => {
                        await HpAnimation(healM, "Heal", "current-hp-1-a", dicesA[0].currentHP, dicesA[0].maxHp)
                        dicesA[0].currentHP = (Math.min(dicesA[0].maxHp, dicesA[0].currentHP + healM));
                        //implementar funcion para actualizar el hp
                        //innerHTMLFormat("current-hp-1-a", dicesA[0].currentHP);
                        innerHTMLFormat("select-dice-btn-a-4", "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    },
                    "select-dice-btn-a-2": async () => {
                        await HpAnimation(healM, "Heal", "current-hp-2-a", dicesA[1].currentHP, dicesA[1].maxHp)
                        dicesA[1].currentHP = (Math.min(dicesA[1].maxHp, dicesA[1].currentHP + healM));
                        //implementar funcion para actualizar el hp
                        //innerHTMLFormat("current-hp-2-a", dicesA[1].currentHP);
                        innerHTMLFormat("select-dice-btn-a-4", "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    },
                    "select-dice-btn-a-3": async () => {
                        await HpAnimation(healM, "Heal", "current-hp-3-a", dicesA[2].currentHP, dicesA[2].maxHp)
                        dicesA[2].currentHP = (Math.min(dicesA[2].maxHp, dicesA[2].currentHP + healM));
                        //implementar funcion para actualizar el hp
                        //innerHTMLFormat("current-hp-3-a", dicesA[2].currentHP);
                        innerHTMLFormat("select-dice-btn-a-4", "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    }
                }
            } else {
                ToggleAllButtons("b", "on");
                diceMcD = {
                    "select-dice-btn-b-1": async () => {
                        await HpAnimation(healM, "Heal", "current-hp-1-b", dicesB[0].currentHP, dicesB[0].maxHp)
                        dicesB[0].currentHP = (Math.min(dicesB[0].maxHp, dicesB[0].currentHP + healM));
                        //implementar funcion para actualizar el hp
                        //innerHTMLFormat("current-hp-1-b", dicesB[0].currentHP);
                        innerHTMLFormat("select-dice-btn-b-4", "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    },
                    "select-dice-btn-b-2": async () => {
                        await HpAnimation(healM, "Heal", "current-hp-2-b", dicesB[1].currentHP, dicesB[1].maxHp)
                        dicesB[1].currentHP = (Math.min(dicesB[1].maxHp, dicesB[1].currentHP + healM));
                        //implementar funcion para actualizar el hp
                        //innerHTMLFormat("current-hp-2-b", dicesB[1].currentHP);
                        innerHTMLFormat("select-dice-btn-b-4", "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    },
                    "select-dice-btn-b-3": async () => {
                        await HpAnimation(healM, "Heal", "current-hp-3-b", dicesB[2].currentHP, dicesB[2].maxHp)
                        dicesB[2].currentHP = (Math.min(dicesB[2].maxHp, dicesB[2].currentHP + healM));
                        //implementar funcion para actualizar el hp
                        //innerHTMLFormat("current-hp-3-b", dicesB[2].currentHP);
                        innerHTMLFormat("select-dice-btn-b-4", "Attack");
                        ToggleAttackButtons();
                        ToggleButton(`select-dice-btn-${turn}-4`, "on")
                    }
                }
            }
            WaitButtons(diceMcD, () => {
                DisableTrayButtons(diceMcD);
            })
            break;
        case "McorD":
            Roll("d6");
            let corDM = rollD
            Roll("d4");
            innerHTMLFormat("dice-s", `corD(${corDM} * ${rollD}) (${corDM * rollD})`)
            cordice = rollD * corDM
            innerHTMLFormat(`select-dice-btn-${turn}-4`, "Attack");
            break;
        case "fD":
            Roll("d4");
            innerHTMLFormat("dice-s", `fD(${rollD})`)
            if (rollD == 1) {
                innerHTMLFormat(`alert-${turn}`, "Dice effect fails!")
            } else {
                innerHTMLFormat(`alert-${turn}`, "Fire effect activated!")
                fdice = true;
            }
            innerHTMLFormat(`select-dice-btn-${turn}-4`, "Attack");
            break;
    }
}

function ToggleAllButtons(command, onoff) {
    console.log(command, onoff)
    switch (command) {
        case "all":
            for (let i = 0; i < 3; i++) {
                ToggleButton(`select-dice-btn-a-${i + 1}`, onoff)
                ToggleButton(`select-dice-btn-b-${i + 1}`, onoff)
            }
            break;
        case "a":
            for (let i = 0; i < 3; i++) {
                ToggleButton(`select-dice-btn-a-${i + 1}`, onoff)
            }
            break;
        case "b":
            for (let i = 0; i < 3; i++) {
                ToggleButton(`select-dice-btn-b-${i + 1}`, onoff)
            }
            break;
    }
}

function ToggleAttackButtons() {
    if (turn == "a") {
        let i = 0
        dicesA.forEach(obj => {
            i++;
            if (obj.attack == false) {
                ToggleButton(`select-dice-btn-a-${i}`, "off")
            }
        })
        let deadDice = []
        for (let j = 0; j < dicesA.length; j++) {
            if (dicesA[j].currentHP <= 0) {
                deadDice.push(1)
            }
        }
        if (deadDice.length > 1) {
            ToggleAllButtons("a", "on")
        }
    } else {
        let i = 0
        dicesB.forEach(obj => {
            i++;
            if (obj.attack == false) {
                ToggleButton(`select-dice-btn-b-${i}`, "off")
            }
        })
        let deadDice = []
        for (let j = 0; j < dicesB.length; j++) {
            if (dicesB[j].currentHP <= 0) {
                deadDice.push(1)
            }
        }
        if (deadDice.length > 1) {
            ToggleAllButtons("b", "on")
        }
    }
}

function ToggleDefenseButtons() {
    if (turn == "a") {
        let i = 0
        dicesA.forEach(obj => {
            i++;
            if (obj.defense == false) {
                ToggleButton(`select-dice-btn-a-${i}`, "off")
            }
        })
        let deadDice = []
        for (let j = 0; j < dicesA.length; j++) {
            if (dicesA[j].currentHP <= 0) {
                deadDice.push(1)
            }
        }
        if (deadDice.length > 1) {
            ToggleAllButtons("a", "on")
        }
    } else {
        let i = 0
        dicesB.forEach(obj => {
            i++;
            if (obj.defense == false) {
                ToggleButton(`select-dice-btn-b-${i}`, "off")
            }
        })
        let deadDice = []
        for (let j = 0; j < dicesB.length; j++) {
            if (dicesB[j].currentHP <= 0) {
                deadDice.push(1)
            }
        }
        if (deadDice.length > 1) {
            ToggleAllButtons("b", "on")
        }
    }
}

function KillDice() {
    for (let i = 0; i < dicesA.length; i++) {
        if (dicesA[i].currentHP == 0) {
            dicesA[i].status = "Dead"
            dicesA[i].statusTurn = 0
            vdiceA[i] = false
            fdiceA[i] = false
            document.getElementById(`select-dice-btn-a-${i + 1}`).style.display = "none"
            innerHTMLFormat(`dice-type-${i + 1}-a`, dicesA[i].name)
        }
    }
    for (let i = 0; i < dicesB.length; i++) {
        if (dicesB[i].currentHP == 0) {
            dicesB[i].status = "Dead"
            dicesB[i].statusTurn = 0
            vdiceB[i] = false
            fdiceB[i] = false
            document.getElementById(`select-dice-btn-b-${i + 1}`).style.display = "none"
            innerHTMLFormat(`dice-type-${i + 1}-b`, dicesB[i].name)
        }
    }
}

function CheckWinner() {
    if ((turn == "a" && ((dicesB[0].currentHP == 0 && dicesB[1].currentHP == 0) && dicesB[2].currentHP == 0))) {
        ToggleGridElement("roll-tray-roll-div-id", "off")
        innerHTMLFormat("btn-gs", "Restart")
        innerHTMLFormat("alert-gs", "Player a Wins!")
        ToggleButton("btn-gs", "on")
        ToggleGridElement("game-start-id", "on")
        waitButton("btn-gs", () => {
            Reset()
        })
    } else if ((turn == "b" && ((dicesA[0].currentHP == 0 && dicesA[1].currentHP == 0) && dicesA[2].currentHP == 0))) {
        ToggleGridElement("roll-tray-roll-div-id", "off")
        innerHTMLFormat("btn-gs", "Restart")
        innerHTMLFormat("alert-gs", "Player b Wins!")
        ToggleButton("btn-gs", "on")
        ToggleGridElement("game-start-id", "on")
        waitButton("btn-gs", () => {
            Reset()
        })
    } else {
        NextTurn()
        DrawPhase()
    }
}

function Reset() {
    gameRound = 1;
    specialH = false;
    specialD = false;
    cordice = 0;
    vdice = false;
    vdiceA = [false, false, false];
    vdiceB = [false, false, false]
    fdice = false;
    fdiceA = [false, false, false];
    fdiceB = [false, false, false];
    checkStartA = false
    checkStartB = false
    statCheckStartA = true
    statCheckStartB = true
    readyForCleanse
    CleanseFirstCheck = true
    turn = "a"; //Define el turno de los jugadores
    rollD = 0; //Guarda la tirada de un dado
    playerA = 0; //guarda la tirada del jugador a para el orden de inicio
    playerB = 0; //guarda la tirada del jugador b para el orden de inicio
    dicesA = ["", "", ""]; //juarda los objetos de los dados del jugador a
    dicesB = ["", "", ""]; //juarda los objetos de los dados del jugador b
    assignPhaseDice = 0; // contador de iteraciones de acciones por jugador la fase de asignacion I y II
    assignPhaseturn = 1; // contador de iteraciones de turnos de la fase de asignacion I y II
    typeAPhIa = []; // guarda el tipo de dado para pasarlo como argumento al contructor de objetos de dados para el jugador a
    diceAPhIa = []; // guarda el nombre dado para pasarlo como argumento al contructor de objetos de dados para el jugador a
    typeAPhIb = []; // guarda el tipo de dado para pasarlo como argumento al contructor de objetos de dados para el jugador b
    diceAPhIb = []; // guarda el nombre dado para pasarlo como argumento al contructor de objetos de dados para el jugador b
    throwsAPhII = [0]; //guarda las tiradas en la fase de recogida de dados para que no se repia el dado seleccionado al empezar la partida.
    diceTrayA = [0, 0, 0, 1, 1, 1];
    diceTrayB = [0, 0, 0, 1, 1, 1];
    attdef = [0, 0];
    gameTimerPause = 375;
    checkPhaseCounter = 0;
    for (let i = 0; i < dicesA.length; i++) {
        document.getElementById(`select-dice-btn-a-${i + 1}`).style.display = "inline-block"
        innerHTMLFormat(`select-dice-btn-a-${i + 1}`, "")
        innerHTMLFormat(`dice-type-${i + 1}-a`, "")
        innerHTMLFormat(`current-hp-${i + 1}-a`, "")
        innerHTMLFormat(`max-hp-${i + 1}-a`, "")
        innerHTMLFormat(`dt-a-${i + 1}`, "")
        innerHTMLFormat(`dt-a-${i + 4}`, "")
    }
    for (let i = 0; i < dicesB.length; i++) {
        document.getElementById(`select-dice-btn-b-${i + 1}`).style.display = "inline-block"
        innerHTMLFormat(`select-dice-btn-b-${i + 1}`, "")
        innerHTMLFormat(`dice-type-${i + 1}-b`, "")
        innerHTMLFormat(`current-hp-${i + 1}-b`, "")
        innerHTMLFormat(`max-hp-${i + 1}-b`, "")
        innerHTMLFormat(`dt-b-${i + 1}`, "")
        innerHTMLFormat(`dt-b-${i + 4}`, "")
    }
    innerHTMLFormat(`select-dice-btn-a-4`, "Roll SP")
    innerHTMLFormat(`select-dice-btn-b-4`, "Roll SP")
    StartGame()
}

function AssignMainTrayActions() {
    let buttonS = document.getElementById("dice-s");
    let buttonD = document.getElementById("dice-d");
    buttonS.style.cursor = "pointer"
    buttonD.style.cursor = "pointer"
    buttonS.onclick = () => {
        ReturnToDiceTrayDS();
    }
    buttonD.onclick = () => {
        ReturnToDiceTrayDD();
    }
}

function ReturnToDiceTrayDS() {
    let diceS = document.getElementById("dice-s");
    if (diceS.innerHTML != "") {
        if (turn == "a") {
            let emptytray = diceTrayA.indexOf(1)
            diceTrayA[emptytray] = diceS.innerHTML
            innerHTMLFormat(`dt-a-${emptytray + 1}`, diceS.innerHTML)
            innerHTMLFormat("dice-s", "")
        } else {
            let emptytray = diceTrayB.indexOf(1)
            diceTrayB[emptytray] = diceS.innerHTML
            innerHTMLFormat(`dt-b-${emptytray + 1}`, diceS.innerHTML)
            innerHTMLFormat("dice-s", "")
        }
    }
}

function ReturnToDiceTrayDD() {
    let diceD = document.getElementById("dice-d");
    if (diceD.innerHTML != "") {
        if (turn == "a") {
            let emptytray = diceTrayA.indexOf(0)
            diceTrayA[emptytray] = diceD.innerHTML
            innerHTMLFormat(`dt-a-${emptytray + 1}`, diceD.innerHTML)
            innerHTMLFormat("dice-d", "")
        } else {
            let emptytray = diceTrayB.indexOf(0)
            diceTrayB[emptytray] = diceD.innerHTML
            innerHTMLFormat(`dt-b-${emptytray + 1}`, diceD.innerHTML)
            innerHTMLFormat("dice-d", "")
        }
    }
}

function ClearBoard() {
    let board = ["dice-d", "dice-m", "dice-s", "dice-total", "alert-a", "alert-b"]
    for (let i = 0; i < board.length; i++) {
        innerHTMLFormat(board[i], "")
    }
}
function StartGame() { // flujo para empezar el juego, esta funcion decide el orden de turnos de toda la partida
    innerHTMLFormat("alert-gs", `Player ${turn}, Roll the dice`);
    innerHTMLFormat("btn-gs", "Roll d4");
    waitButton("btn-gs", function () {
        Roll("d4");
        innerHTMLFormat("alert-gs", rollD);
        if (turn == "a") {
            playerA = rollD;
        } else {
            playerB = rollD;
        }
        if (playerB == 0) {
            NextTurn();
            ToggleButton("btn-gs", "off")
            setTimeout(() => {
                ToggleButton("btn-gs", "on");
                StartGame();
            }, gameTimerPause);
        } else {
            if (playerA == playerB) {
                setTimeout(() => {
                    playerA = 0;
                    playerB = 0;
                    NextTurn();
                    innerHTMLFormat("alert-gs", "Tie! Roll again")
                    ToggleButton("btn-gs", "off")
                    setTimeout(() => {
                        ToggleButton("btn-gs", "on");
                        StartGame();
                    }, gameTimerPause);
                }, gameTimerPause);
            } else {
                ToggleButton("btn-gs", "off")
                setTimeout(() => {
                    if (playerA > playerB) {
                        innerHTMLFormat("alert-gs", "Player a starts")
                        turn = "a"
                    } else {
                        innerHTMLFormat("alert-gs", "Player b starts")
                        turn = "b"
                    }
                    ToggleButton("btn-gs", "on");
                    AssignPhaseI()
                }, gameTimerPause);
            }
        }
    });
};

function AssignPhaseI() { //asigna a cada jugador 6 dados
    innerHTMLFormat("alert-gs", `Player ${turn}, Roll to draw a dice`)
    innerHTMLFormat("btn-gs", "Roll dT10");
    if (assignPhaseturn < 3) {
        waitButton("btn-gs", () => {
            Roll("dT10");
            innerHTMLFormat("alert-gs", rollD);
            let type = GetType(rollD);
            let dice = GetDiceTens(rollD); //guarda el tipo y el nombre para ponerlos en el dicetray como string
            if (turn == "a") {
                typeAPhIa[assignPhaseDice] = type;
                diceAPhIa[assignPhaseDice] = dice;
            } else {
                typeAPhIb[assignPhaseDice] = type;
                diceAPhIb[assignPhaseDice] = dice;
            }
            innerHTMLFormat(`dt-${turn}-${(assignPhaseDice + 1)}`, (rollD + " " + dice + type));
            if (assignPhaseDice == 5) {
                assignPhaseDice = 0;
                assignPhaseturn++;
                NextTurn();
            } else {
                assignPhaseDice++;
            }
            ToggleButton("btn-gs", "off")
            setTimeout(() => {
                ToggleButton("btn-gs", "on");
                AssignPhaseI();
            }, gameTimerPause);
        })
    } else {
        assignPhaseDice = 0;
        assignPhaseturn = 1;
        AssignPhaseII();
    }
}

function AssignPhaseII() { // asigna 3 dados al azar de los conseguidos e la fase I de asignacion
    innerHTMLFormat("alert-gs", `Player ${turn}, Roll to get a dice`)
    innerHTMLFormat("btn-gs", "Roll d6");
    if (assignPhaseturn < 3) {
        waitButton("btn-gs", () => {
            Roll("d6");
            innerHTMLFormat("alert-gs", rollD);
            if (throwsAPhII.includes(rollD)) {
                ToggleButton("btn-gs", "off")
                setTimeout(() => {
                    innerHTMLFormat("alert-gs", `Already Taken!, roll again!`)
                    setTimeout(() => {
                        ToggleButton("btn-gs", "on");
                        AssignPhaseII()
                    }, gameTimerPause);
                }, gameTimerPause);
            } else {
                throwsAPhII.push(rollD)
                if (turn == "a") {
                    dicesA[assignPhaseDice] = new CreateDice(diceAPhIa[(rollD - 1)], typeAPhIa[(rollD - 1)]);
                    dicesA[assignPhaseDice].slotIndex = assignPhaseDice
                    innerHTMLFormat(`dice-type-${(assignPhaseDice + 1)}-a`, dicesA[assignPhaseDice].name)
                    innerHTMLFormat(`select-dice-btn-a-${(assignPhaseDice + 1)}`, dicesA[assignPhaseDice].name)
                    innerHTMLFormat(`current-hp-${(assignPhaseDice + 1)}-a`, dicesA[assignPhaseDice].currentHP)
                    let currentHpStyle = document.getElementById(`current-hp-${(assignPhaseDice + 1)}-a`) 
                    currentHpStyle.style.textShadow = "1px 1px 2px limegreen, 0 0 1em green, 0 0 0.2em limegreen"
                    innerHTMLFormat(`max-hp-${(assignPhaseDice + 1)}-a`, dicesA[assignPhaseDice].maxHp)
                    let maxHpStyle = document.getElementById(`max-hp-${(assignPhaseDice + 1)}-a`) 
                    maxHpStyle.style.textShadow = "1px 1px 2px limegreen, 0 0 1em green, 0 0 0.2em limegreen"
                    innerHTMLFormat(`dt-a-${((rollD))}`, "");
                } else {
                    dicesB[assignPhaseDice] = new CreateDice(diceAPhIb[(rollD - 1)], typeAPhIb[(rollD - 1)]);
                    dicesB[assignPhaseDice].slotIndex = assignPhaseDice
                    innerHTMLFormat(`dice-type-${(assignPhaseDice + 1)}-b`, dicesB[assignPhaseDice].name)
                    innerHTMLFormat(`select-dice-btn-b-${(assignPhaseDice + 1)}`, dicesB[assignPhaseDice].name)
                    innerHTMLFormat(`current-hp-${(assignPhaseDice + 1)}-b`, dicesB[assignPhaseDice].currentHP)
                    let currentHpStyle = document.getElementById(`current-hp-${(assignPhaseDice + 1)}-b`) 
                    currentHpStyle.style.textShadow = "1px 1px 2px limegreen, 0 0 1em green, 0 0 0.2em limegreen"
                    innerHTMLFormat(`max-hp-${(assignPhaseDice + 1)}-b`, dicesB[assignPhaseDice].maxHp)
                    let maxHpStyle = document.getElementById(`max-hp-${(assignPhaseDice + 1)}-b`) 
                    maxHpStyle.style.textShadow = "1px 1px 2px limegreen, 0 0 1em green, 0 0 0.2em limegreen"
                    innerHTMLFormat(`dt-b-${((rollD))}`, "");
                }
                if (assignPhaseDice == 2) {
                    assignPhaseDice = 0;
                    assignPhaseturn++;
                    setTimeout(() => {
                        for (let i = 1; i < 7; i++) {
                            innerHTMLFormat(`dt-${turn}-${(i)}`, "");
                        }
                        NextTurn();
                    }, gameTimerPause);
                    throwsAPhII = [];
                } else {
                    assignPhaseDice++;
                }
                ToggleButton("btn-gs", "off")
                setTimeout(() => {
                    ToggleButton("btn-gs", "on");
                    AssignPhaseII();
                }, gameTimerPause);
            }
        })
    } else {
        assignPhaseDice = 0;
        assignPhaseturn = 1;
        InitialDrawPhase();
    }
}

function InitialDrawPhase() {
    innerHTMLFormat("alert-gs", `Player ${turn}, Roll to draw an attack dice`)
    innerHTMLFormat("btn-gs", "Roll d12");
    ToggleButton("btn-gs", "on")
    if (assignPhaseturn < 3) {
        waitButton("btn-gs", () => {
            ToggleButton("btn-gs", "off")
            DrawAttDice()
            if (assignPhaseDice == 2) {
                assignPhaseDice = 0;
                assignPhaseturn++;
                NextTurn();
            } else {
                assignPhaseDice++;
            }
            setTimeout(() => {
                InitialDrawPhase();
            }, gameTimerPause);
        });
    } else {
        ToggleButton("btn-gs", "off")
        innerHTMLFormat("alert-gs", `-`)
        innerHTMLFormat("btn-gs", "-");
        ToggleGridElement("game-start-id", "off");
        ToggleGridElement("roll-tray-roll-div-id", "on");
        setTimeout(() => {
            AttackDefensePhaseI();
        }, gameTimerPause);
    }
    //Logica para sacar los primeros 3 dados de ataque
    //despues se tiene qe implementar un drawphase general que permita añadir dados md4 y borrar slots si esta lleno. usar arrays para guarda esta informacion y crear funcion de actualizacion de datos en la interfaz
}

function DrawPhase() {
    if (gameRound > 2) {
        ToggleGridElement("game-start-id", "on");
        ToggleGridElement("roll-tray-roll-div-id", "off");
        ToggleButton("btn-gs", "on")
        innerHTMLFormat("alert-gs", `Player ${turn}, Roll to draw an attack dice`)
        innerHTMLFormat("btn-gs", "Roll d12");
        waitButton("btn-gs", () => {
            ToggleButton("btn-gs", "off")
            DrawAttDice()
            setTimeout(() => {
                ToggleGridElement("game-start-id", "off");
                ToggleGridElement("roll-tray-roll-div-id", "on");
                AttackDefensePhaseI();
            }, gameTimerPause);
        });
    } else {
        setTimeout(() => {
            ToggleGridElement("game-start-id", "off");
            ToggleGridElement("roll-tray-roll-div-id", "on");
            AttackDefensePhaseI();
        }, gameTimerPause);
    }

}

function AttackDefensePhaseI() {
    //Subfase de seleccion de dados de ataque
    let attackButton;
    ToggleAllButtons(`${turn}`, "on");
    ToggleAttackButtons()
    innerHTMLFormat(`alert-${turn}`, `Player ${turn}, select attack dices`)
    AssignMainTrayActions()
    let attDices = AssignTrayActions();
    WaitButtons(attDices, () => {
        let attButtons = AssignChooseDiceActionsAttack()
        WaitButtons(attButtons, () => {
            DisableTrayButtons(attDices)
            DisableTrayButtons(attButtons)
            if (specialD) {
                innerHTMLFormat(`select-dice-btn-${turn}-4`, `SP (${GetSpecialDnumber()})`)
                innerHTMLFormat(`alert-${turn}`, "Roll SP for special dice effect")
                waitButton(`select-dice-btn-${turn}-4`, () => {
                    RollSpecialDice();
                    //fase de habilidades especiales aqui
                    waitButton(`select-dice-btn-${turn}-4`, () => {
                        innerHTMLFormat(`alert-${turn}`,
                            `total: ${document.getElementById("dice-total").innerHTML} + ${document.getElementById("dice-s").innerHTML}`
                        )
                        if (turn == "a") {
                            attackButton = {
                                "select-dice-btn-a-4": null
                            }
                        } else {
                            attackButton = {
                                "select-dice-btn-b-4": null
                            }
                        }
                        DisableTrayButtons(attackButton)
                        AttackDefensePhaseII();
                    })

                })
            } else {
                innerHTMLFormat(`select-dice-btn-${turn}-4`, `Attack`)
                waitButton(`select-dice-btn-${turn}-4`, () => {
                    innerHTMLFormat(`alert-${turn}`, `total: ${document.getElementById("dice-total").innerHTML}`
                    )
                    if (turn == "a") {
                        attackButton = {
                            "select-dice-btn-a-4": null
                        }
                    } else {
                        attackButton = {
                            "select-dice-btn-b-4": null
                        }
                    }
                    DisableTrayButtons(attackButton)
                    AttackDefensePhaseII();
                })
            }
        });
    });
}

function AttackDefensePhaseII() {
    NextTurn();
    ToggleAllButtons(`${turn}`, "on");
    ToggleDefenseButtons();
    innerHTMLFormat(`alert-${turn}`, "Select defense dice")
    let defDicesActions
    if (turn == "a") {
        defDicesActions = {
            "select-dice-btn-a-1": async () => {
                Roll(dicesA[0].ddice)
                innerHTMLFormat(`alert-a`, rollD)
                let damage = (Math.max(0, (attdef[0] - (Math.max(0, (rollD) - cordice)))))
                console.log(damage)
                await HpAnimation(damage, "Normal", "current-hp-1-a", dicesA[0].currentHP, dicesA[0].maxHp)
                dicesA[0].currentHP = Math.max(0, (dicesA[0].currentHP - damage))
                //innerHTMLFormat("current-hp-1-a", dicesA[0].currentHP)
                dicesA[0].defense = false
                dicesA[1].defense = true
                dicesA[2].defense = true
                if (vdice && dicesA[0].currentHP > 0) {
                    dicesA[0].status = "Venom"
                    dicesA[0].statusTurn = 0
                    vdiceA[0] = true
                    fdiceA[0] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-a`, `Dice Envenomed`)
                        innerHTMLFormat(`dice-type-1-a`, (dicesA[0].name + " V"))
                        ChangeTextColor(`dice-type-1-a`, "purple", "yes", "indigo", "magenta")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else if (fdice && dicesA[0].currentHP > 0) {
                    dicesA[0].status = "Burned"
                    dicesA[0].statusTurn = 0
                    fdiceA[0] = true
                    vdiceA[0] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-a`, `Dice Burned`)
                        innerHTMLFormat(`dice-type-1-a`, (dicesA[0].name + " F"))
                        ChangeTextColor(`dice-type-1-a`, "black", "yes", "crimson", "red")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else {
                    setTimeout(() => {
                        AttDefInterphase()
                    }, gameTimerPause);
                }

            },
            "select-dice-btn-a-2": async () => {
                Roll(dicesA[1].ddice)
                innerHTMLFormat(`alert-a`, rollD)
                let damage = (Math.max(0, (attdef[0] - (Math.max(0, (rollD) - cordice)))))
                console.log(damage)
                await HpAnimation(damage, "Normal", "current-hp-2-a", dicesA[1].currentHP, dicesA[1].maxHp)
                dicesA[1].currentHP = Math.max(0, (dicesA[1].currentHP - damage))
                //innerHTMLFormat("current-hp-2-a", dicesA[1].currentHP)
                dicesA[0].defense = true
                dicesA[1].defense = false
                dicesA[2].defense = true
                if (vdice && dicesA[1].currentHP > 0) {
                    dicesA[1].status = "Venom"
                    dicesA[1].statusTurn = 0
                    vdiceA[1] = true
                    fdiceA[1] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-a`, `Dice Envenomed`)
                        innerHTMLFormat(`dice-type-2-a`, (dicesA[1].name + " V"))
                        ChangeTextColor(`dice-type-2-a`, "purple", "yes", "indigo", "magenta")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else if (fdice && dicesA[1].currentHP > 0) {
                    dicesA[1].status = "Burned"
                    dicesA[1].statusTurn = 0
                    fdiceA[1] = true
                    vdiceA[1] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-a`, `Dice Burned`)
                        innerHTMLFormat(`dice-type-2-a`, (dicesA[0].name + " F"))
                        ChangeTextColor(`dice-type-2-a`, "black", "yes", "crimson", "red")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else {
                    setTimeout(() => {
                        AttDefInterphase()
                    }, gameTimerPause);
                }
            },
            "select-dice-btn-a-3": async () => {
                Roll(dicesA[2].ddice)
                innerHTMLFormat(`alert-a`, rollD)
                let damage = (Math.max(0, (attdef[0] - (Math.max(0, (rollD) - cordice)))))
                console.log(damage)
                await HpAnimation(damage, "Normal", "current-hp-3-a", dicesA[2].currentHP, dicesA[2].maxHp)
                dicesA[2].currentHP = Math.max(0, (dicesA[2].currentHP - damage))
                //innerHTMLFormat("current-hp-3-a", dicesA[2].currentHP)
                dicesA[0].defense = true
                dicesA[1].defense = true
                dicesA[2].defense = false
                if (vdice && dicesA[2].currentHP > 0) {
                    dicesA[2].status = "Venom"
                    dicesA[2].statusTurn = 0
                    vdiceA[2] = true
                    fdiceA[2] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-a`, `Dice Envenomed`)
                        innerHTMLFormat(`dice-type-3-a`, (dicesA[0].name + " V"))
                        ChangeTextColor(`dice-type-3-a`, "purple", "yes", "indigo", "magenta")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else if (fdice && dicesA[2].currentHP > 0) {
                    dicesA[2].status = "Burned"
                    dicesA[2].statusTurn = 0
                    fdiceA[2] = true
                    vdiceA[2] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-a`, `Dice Burned`)
                        innerHTMLFormat(`dice-type-3-a`, (dicesA[2].name + " F"))
                        ChangeTextColor(`dice-type-3-a`, "black", "yes", "crimson", "red")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else {
                    setTimeout(() => {
                        AttDefInterphase()
                    }, gameTimerPause);
                }
            }
        }
    } else {
        defDicesActions = {
            "select-dice-btn-b-1": async () => {
                Roll(dicesB[0].ddice)
                innerHTMLFormat(`alert-b`, rollD)
                let damage = (Math.max(0, (attdef[0] - (Math.max(0, (rollD) - cordice)))))
                console.log(damage)
                await HpAnimation(damage, "Normal", "current-hp-1-b", dicesB[0].currentHP, dicesB[0].maxHp)
                dicesB[0].currentHP = Math.max(0, (dicesB[0].currentHP - damage))
                innerHTMLFormat("current-hp-1-b", dicesB[0].currentHP)
                dicesB[0].defense = false
                dicesB[1].defense = true
                dicesB[2].defense = true
                if (vdice && dicesB[0].currentHP > 0) {
                    dicesB[0].status = "Venom"
                    dicesB[0].statusTurn = 0
                    vdiceB[0] = true
                    fdiceB[0] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-b`, `Dice Envenomed`)
                        innerHTMLFormat(`dice-type-1-b`, (dicesB[0].name + " V"))
                        ChangeTextColor(`dice-type-1-b`, "purple", "yes", "indigo", "magenta")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else if (fdice && dicesB[0].currentHP > 0) {
                    dicesB[0].status = "Burned"
                    dicesB[0].statusTurn = 0
                    fdiceB[0] = true
                    vdiceB[0] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-b`, `Dice Burned`)
                        innerHTMLFormat(`dice-type-1-b`, (dicesB[0].name + " F"))
                        ChangeTextColor(`dice-type-1-b`, "black", "yes", "crimson", "red")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else {
                    setTimeout(() => {
                        AttDefInterphase()
                    }, gameTimerPause);
                }
            },
            "select-dice-btn-b-2": async () => {
                Roll(dicesB[1].ddice)
                innerHTMLFormat(`alert-b`, rollD)
                let damage = (Math.max(0, (attdef[0] - (Math.max(0, (rollD) - cordice)))))
                console.log(damage)
                await HpAnimation(damage, "Normal", "current-hp-2-b", dicesB[1].currentHP, dicesB[1].maxHp)
                dicesB[1].currentHP = Math.max(0, (dicesB[1].currentHP - damage))
                innerHTMLFormat("current-hp-2-b", dicesB[1].currentHP)
                dicesB[0].defense = true
                dicesB[1].defense = false
                dicesB[2].defense = true
                if (vdice && dicesB[1].currentHP > 0) {
                    dicesB[1].status = "Venom"
                    dicesB[0].statusTurn = 0
                    vdiceB[1] = true
                    fdiceB[1] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-b`, `Dice Envenomed`)
                        innerHTMLFormat(`dice-type-2-b`, (dicesB[1].name + " V"))
                        ChangeTextColor(`dice-type-2-b`, "purple", "yes", "indigo", "magenta")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else if (fdice && dicesB[1].currentHP > 0) {
                    dicesB[1].status = "Burned"
                    dicesB[1].statusTurn = 0
                    fdiceB[1] = true
                    vdiceB[1] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-b`, `Dice Burned`)
                        innerHTMLFormat(`dice-type-2-b`, (dicesB[1].name + " F"))
                        ChangeTextColor(`dice-type-2-b`, "black", "yes", "crimson", "red")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else {
                    setTimeout(() => {
                        AttDefInterphase()
                    }, gameTimerPause);
                }
            },
            "select-dice-btn-b-3": async () => {
                Roll(dicesB[2].ddice)
                innerHTMLFormat(`alert-b`, rollD)
                let damage = (Math.max(0, (attdef[0] - (Math.max(0, (rollD) - cordice)))))
                console.log(damage)
                await HpAnimation(damage, "Normal", "current-hp-3-b", dicesB[2].currentHP, dicesB[2].maxHp)
                dicesB[2].currentHP = Math.max(0, (dicesB[2].currentHP - damage))
                innerHTMLFormat("current-hp-3-b", dicesB[2].currentHP)
                dicesB[0].defense = true
                dicesB[1].defense = true
                dicesB[2].defense = false
                if (vdice && dicesB[2].currentHP > 0) {
                    dicesB[2].status = "Venom"
                    dicesB[2].statusTurn = 0
                    vdiceB[2] = true
                    fdiceB[2] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-b`, `Dice Envenomed`)
                        innerHTMLFormat(`dice-type-3-b`, (dicesB[2].name + " V"))
                        ChangeTextColor(`dice-type-3-b`, "purple", "yes", "indigo", "magenta")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else if (fdice && dicesB[2].currentHP > 0) {
                    dicesB[2].status = "Burned"
                    dicesB[2].statusTurn = 0
                    fdiceB[2] = true
                    vdiceB[2] = false
                    setTimeout(() => {
                        innerHTMLFormat(`alert-b`, `Dice Burned`)
                        innerHTMLFormat(`dice-type-3-b`, (dicesB[2].name + " F"))
                        ChangeTextColor(`dice-type-3-b`, "black", "yes", "crimson", "red")
                        setTimeout(() => {
                            AttDefInterphase()
                        }, gameTimerPause);
                    }, gameTimerPause);
                } else {
                    setTimeout(() => {
                        AttDefInterphase()
                    }, gameTimerPause);
                }
            }
        }
    }
    setTimeout(() => {
        console.log(defDicesActions)
        WaitButtons(defDicesActions, () => {
            DisableTrayButtons(defDicesActions);
            KillDice()
        })
    }, gameTimerPause);
}

function AttDefInterphase() {
    innerHTMLFormat(`alert-${turn}`, `Total damage: ${Math.max(0, (attdef[0] - (Math.max(0, (rollD - cordice)))))}`)
    setTimeout(() => {
        ClearBoard()
        KillDice()
        NextTurn();
        if (turn == "a") {
            checkStartB = true
            innerHTMLFormat("alert-gs", "Status Check Player B")
            innerHTMLFormat("btn-gs", "Start Check")
            StatusCheckPhaseB()
        } else {
            checkStartA = true
            innerHTMLFormat("alert-gs", "Status Check Player A")
            innerHTMLFormat("btn-gs", "Start Check")
            StatusCheckPhaseA();
        }
    }, gameTimerPause);
}

function StatusCheckPhaseA() {
    console.log("Status Check Phase A")
    if (vdiceA.includes(true) || fdiceA.includes(true)) {
        if (((vdiceA.includes(true) && fdiceA.includes(true)) && statCheckStartA)) {
            checkPhaseCounter = Math.min(vdiceA.indexOf(true), fdiceA.indexOf(true))
            statCheckStartA = false
        } else if (vdiceA.includes(true) && statCheckStartA) {
            checkPhaseCounter = vdiceA.indexOf(true)
            statCheckStartA = false
        } else if (fdiceA.includes(true) && statCheckStartA) {
            checkPhaseCounter = fdiceA.indexOf(true)
            statCheckStartA = false
        }
        if (checkPhaseCounter <= 2) {
            ToggleButton("btn-gs", "on")
            innerHTMLFormat("alert-gs", "Status Check Player A")
            DisableTrayButtons((btn = { "btn-gs": () => { return null } }))
            ToggleGridElement("roll-tray-roll-div-id", "off")
            ToggleGridElement("game-start-id", "on")
            innerHTMLFormat("btn-gs", "Check dice")
            waitButton("btn-gs", () => {
                if (dicesA[checkPhaseCounter].status == "Venom") {
                    innerHTMLFormat("alert-gs", `Rolling d4 for Venom damage on Player a's ${dicesA[checkPhaseCounter].name}`)
                    innerHTMLFormat("btn-gs", "Roll d4")
                    waitButton("btn-gs", () => {
                        ToggleButton("btn-gs", "off")
                        Roll("d4")
                        innerHTMLFormat("alert-gs", rollD)
                        HpAnimation(rollD, "Venom", `current-hp-${checkPhaseCounter + 1}-a`, dicesA[checkPhaseCounter].currentHP, dicesA[checkPhaseCounter].maxHp)
                        innerHTMLFormat(`alert-a`, `${rollD} Venom damage to Player a's ${dicesA[checkPhaseCounter].name}`)
                        dicesA[checkPhaseCounter].currentHP = Math.max(0, dicesA[checkPhaseCounter].currentHP - rollD)
                        dicesA[checkPhaseCounter].statusTurn++;
                        KillDice()
                        //innerHTMLFormat(`current-hp-${checkPhaseCounter + 1}-a`, dicesA[checkPhaseCounter].currentHP)
                        if ((checkPhaseCounter == 0 && vdiceA[1] == true) || (checkPhaseCounter == 0 && fdiceA[1] == true)) {
                            checkPhaseCounter = 1;
                        } else if ((checkPhaseCounter <= 1 && vdiceA[2] == true) || (checkPhaseCounter <= 1 && fdiceA[2] == true)) {
                            checkPhaseCounter = 2
                        } else {
                            checkPhaseCounter = 3
                        }
                        setTimeout(() => {
                            innerHTMLFormat("alert-a", "")
                            StatusCheckPhaseA();
                        }, gameTimerPause);
                    })
                } else if (dicesA[checkPhaseCounter].status == "Burned") {
                    innerHTMLFormat("alert-gs", `Rolling d6 for Burn damage on Player a's ${dicesA[checkPhaseCounter].name}`)
                    innerHTMLFormat("btn-gs", "Roll d6")
                    waitButton("btn-gs", () => {
                        ToggleButton("btn-gs", "off")
                        Roll("d6")
                        innerHTMLFormat("alert-gs", rollD)
                        HpAnimation(rollD, "Fire", `current-hp-${checkPhaseCounter + 1}-a`, dicesA[checkPhaseCounter].currentHP, dicesA[checkPhaseCounter].maxHp)
                        innerHTMLFormat(`alert-a`, `${rollD} Burn damage to Player a's ${dicesA[checkPhaseCounter].name}`)
                        dicesA[checkPhaseCounter].currentHP = Math.max(0, dicesA[checkPhaseCounter].currentHP - rollD)
                        dicesA[checkPhaseCounter].statusTurn++;
                        KillDice()
                        //innerHTMLFormat(`current-hp-${checkPhaseCounter + 1}-a`, dicesA[checkPhaseCounter].currentHP)
                        if ((checkPhaseCounter == 0 && vdiceA[1] == true) || (checkPhaseCounter == 0 && fdiceA[1] == true)) {
                            checkPhaseCounter = 1;
                        } else if ((checkPhaseCounter <= 1 && vdiceA[2] == true) || (checkPhaseCounter <= 1 && fdiceA[2] == true)) {
                            checkPhaseCounter = 2
                        } else {
                            checkPhaseCounter = 3
                        }
                        setTimeout(() => {
                            innerHTMLFormat("alert-a", "")
                            StatusCheckPhaseA();
                        }, gameTimerPause);
                    })
                } else {
                    checkPhaseCounter = 3
                    StatusCheckPhaseA();
                }
            })
        } else {
            innerHTMLFormat("alert-a", "")
            checkPhaseCounter = 0
            setTimeout(() => {
                if (checkStartA) {
                    KillDice()
                    StatusCheckPhaseB()
                } else {
                    checkPhaseCounter = 0
                    ToggleGridElement("roll-tray-roll-div-id", "on")
                    ToggleGridElement("game-start-id", "off")
                    checkStartA = false
                    checkStartB = false
                    KillDice()
                    CleanseStatusPhase()
                }
            }, gameTimerPause);
        }
    } else {
        checkPhaseCounter = 0
        setTimeout(() => {
            if (checkStartA) {
                KillDice()
                StatusCheckPhaseB()
            } else {
                checkStartA = false
                checkStartB = false
                ToggleGridElement("roll-tray-roll-div-id", "on")
                ToggleGridElement("game-start-id", "off")
                KillDice()
                CleanseStatusPhase()
            }
        }, gameTimerPause);
    }
}

function StatusCheckPhaseB() {
    console.log("Status Check Phase B")
    if (vdiceB.includes(true) || fdiceB.includes(true)) {
        if ((vdiceB.includes(true) && fdiceB.includes(true)) && statCheckStartB) {
            checkPhaseCounter = Math.min(vdiceB.indexOf(true), fdiceB.indexOf(true))
            statCheckStartB = false
        } else if (vdiceB.includes(true) && statCheckStartB) {
            checkPhaseCounter = vdiceB.indexOf(true)
            statCheckStartB = false
        } else if (fdiceB.includes(true) && statCheckStartB) {
            checkPhaseCounter = fdiceB.indexOf(true)
            statCheckStartB = false
        }
        if (checkPhaseCounter <= 2) {
            innerHTMLFormat("alert-gs", "Status Check Player B")
            ToggleButton("btn-gs", "on")
            DisableTrayButtons((btn = { "btn-gs": () => { return null } }))
            ToggleGridElement("roll-tray-roll-div-id", "off")
            ToggleGridElement("game-start-id", "on")
            innerHTMLFormat("btn-gs", "Check dice")
            waitButton("btn-gs", () => {
                if (dicesB[checkPhaseCounter].status == "Venom") {
                    innerHTMLFormat("alert-gs", `Rolling d4 for Venom damage on Player b's ${dicesB[checkPhaseCounter].name}`)
                    innerHTMLFormat("btn-gs", "Roll d4")
                    waitButton("btn-gs", () => {
                        ToggleButton("btn-gs", "off")
                        Roll("d4")
                        innerHTMLFormat("alert-gs", rollD)
                        HpAnimation(rollD, "Venom", `current-hp-${checkPhaseCounter + 1}-b`, dicesB[checkPhaseCounter].currentHP, dicesB[checkPhaseCounter].maxHp)
                        innerHTMLFormat(`alert-b`, `${rollD} Venom damage to Player b's ${dicesB[checkPhaseCounter].name}`)
                        dicesB[checkPhaseCounter].currentHP = Math.max(0, dicesB[checkPhaseCounter].currentHP - rollD)
                        dicesB[checkPhaseCounter].statusTurn++;
                        KillDice()
                        //innerHTMLFormat(`current-hp-${checkPhaseCounter + 1}-b`, dicesB[checkPhaseCounter].currentHP)
                        if ((checkPhaseCounter == 0 && vdiceB[1] == true) || (checkPhaseCounter == 0 && fdiceB[1] == true)) {
                            checkPhaseCounter++;
                        } else if ((checkPhaseCounter <= 1 && vdiceB[2] == true) || (checkPhaseCounter <= 1 && fdiceB[2] == true)) {
                            if (checkPhaseCounter == 0) {
                                checkPhaseCounter += 2
                            } else {
                                checkPhaseCounter++
                            }
                        } else {
                            checkPhaseCounter = 3
                        }
                        setTimeout(() => {
                            innerHTMLFormat("alert-b", "")
                            StatusCheckPhaseB();
                        }, gameTimerPause);
                    })
                } else if (dicesB[checkPhaseCounter].status == "Burned") {
                    innerHTMLFormat("alert-gs", `Rolling d6 for Burn damage on Player b's ${dicesB[checkPhaseCounter].name}`)
                    innerHTMLFormat("btn-gs", "Roll d6")
                    waitButton("btn-gs", () => {
                        ToggleButton("btn-gs", "off")
                        Roll("d6")
                        innerHTMLFormat("alert-gs", rollD)
                        HpAnimation(rollD, "Fire", `current-hp-${checkPhaseCounter + 1}-b`, dicesB[checkPhaseCounter].currentHP, dicesB[checkPhaseCounter].maxHp)
                        innerHTMLFormat(`alert-b`, `${rollD} Burn damage to Player b's ${dicesB[checkPhaseCounter].name}`)
                        dicesB[checkPhaseCounter].currentHP = Math.max(0, dicesB[checkPhaseCounter].currentHP - rollD)
                        dicesB[checkPhaseCounter].statusTurn++;
                        KillDice()
                        //innerHTMLFormat(`current-hp-${checkPhaseCounter + 1}-b`, dicesB[checkPhaseCounter].currentHP)
                        if ((checkPhaseCounter == 0 && vdiceB[1] == true) || (checkPhaseCounter == 0 && fdiceB[1] == true)) {
                            checkPhaseCounter++;
                        } else if ((checkPhaseCounter <= 1 && vdiceB[2] == true) || (checkPhaseCounter <= 1 && fdiceB[2] == true)) {
                            if (checkPhaseCounter == 0) {
                                checkPhaseCounter += 2
                            } else {
                                checkPhaseCounter++
                            }
                        } else {
                            checkPhaseCounter = 3
                        }
                        setTimeout(() => {
                            innerHTMLFormat("alert-b", "")
                            StatusCheckPhaseB();
                        }, gameTimerPause);
                    })
                }
            })
        } else {
            innerHTMLFormat("alert-b", "")
            checkPhaseCounter = 0;
            if (checkStartB) {
                KillDice()
                StatusCheckPhaseA()
            } else {
                ToggleGridElement("roll-tray-roll-div-id", "on")
                ToggleGridElement("game-start-id", "off")
                checkStartA = false
                checkStartB = false
                KillDice()
                CleanseStatusPhase()
            }
        }
    } else {
        innerHTMLFormat("alert-b", "")
        checkPhaseCounter = 0;
        if (checkStartB) {
            KillDice()
            StatusCheckPhaseA()
        } else {
            ToggleGridElement("roll-tray-roll-div-id", "on")
            ToggleGridElement("game-start-id", "off")
            checkStartA = false
            checkStartB = false
            KillDice()
            CleanseStatusPhase()
        }
    }
}

function CleanseStatusPhase() {
    if (turn == "a" && (vdiceA.includes(true) || fdiceA.includes(true))) {
        if (CleanseFirstCheck) {
            readyForCleanse = [dicesA[0], dicesA[1], dicesA[2]]
            for (let i = readyForCleanse.length - 1; i >= 0; i--) {
                if (readyForCleanse[i].statusTurn < 4) {
                    readyForCleanse.splice(i, 1)
                }
            }
            console.log(readyForCleanse)
            checkPhaseCounter = readyForCleanse.length > 0 ? readyForCleanse[0].slotIndex : 3
            console.log("checkPhaseCounter: ", checkPhaseCounter)
            CleanseFirstCheck = false
        }
        if (readyForCleanse.length > 0 && checkPhaseCounter < 3) {
            innerHTMLFormat("alert-gs", "Status Cleanse Player A")
            ToggleButton("btn-gs", "on")
            DisableTrayButtons((btn = { "btn-gs": () => { return null } }))
            ToggleGridElement("roll-tray-roll-div-id", "off")
            ToggleGridElement("game-start-id", "on")
            innerHTMLFormat("btn-gs", "Cleanse dice")
            waitButton("btn-gs", () => {
                innerHTMLFormat("alert-gs", `Rolling ${dicesA[checkPhaseCounter].name} to cleanse ${dicesA[checkPhaseCounter].status} on Player a's ${dicesA[checkPhaseCounter].name} (${dicesA[checkPhaseCounter].statusCleanse} or more)`)
                innerHTMLFormat("btn-gs", `Roll ${dicesA[checkPhaseCounter].name}`)
                waitButton("btn-gs", () => {
                    ToggleButton("btn-gs", "off")
                    Roll(dicesA[checkPhaseCounter].name)
                    innerHTMLFormat("alert-gs", rollD)
                    if (rollD >= (dicesA[checkPhaseCounter].statusCleanse)) {
                        innerHTMLFormat("alert-a", `${dicesA[checkPhaseCounter].status} cleansed`)
                        innerHTMLFormat(`dice-type-${checkPhaseCounter + 1}-a`, dicesA[checkPhaseCounter].name)
                        ChangeTextColor(`dice-type-${checkPhaseCounter + 1}-a`, "#a0c25b", "no")
                        if (dicesA[checkPhaseCounter].status == "Venom") {
                            vdiceA[checkPhaseCounter] = false
                        } else if (dicesA[checkPhaseCounter].status == "Burned") {
                            fdiceA[checkPhaseCounter] = false
                        }
                        dicesA[checkPhaseCounter].status = "Normal"
                        dicesA[checkPhaseCounter].statusTurn = 0
                    } else {
                        innerHTMLFormat("alert-a", `Cleanse Failed!`)
                    }
                    if (checkPhaseCounter == 0 && dicesA[checkPhaseCounter + 1].statusTurn >= 3) {
                        checkPhaseCounter = 1
                    } else if (checkPhaseCounter == 1 && dicesA[checkPhaseCounter + 1].statusTurn >= 3) {
                        checkPhaseCounter = 2
                    } else {
                        checkPhaseCounter = 3
                    }
                    setTimeout(() => {
                        innerHTMLFormat("alert-b", "")
                        CleanseStatusPhase();
                    }, gameTimerPause);
                })
            })
        } else {
            ToggleGridElement("roll-tray-roll-div-id", "on")
            ToggleGridElement("game-start-id", "off")
            checkPhaseCounter = 0
            CleanseFirstCheck = true
            FinalPhase()
        }
    } else if ((turn == "b" && (vdiceB.includes(true) || fdiceB.includes(true)))) {
        console.log("vdiceB: ", vdiceB.includes(true), "fdiceB:", fdiceB.includes(true))
        console.log("Turno: ", turn)
        console.log((turn == "b" && (vdiceB.includes(true) || fdiceB.includes(true))))
        if (CleanseFirstCheck) {
            readyForCleanse = [dicesB[0], dicesB[1], dicesB[2]]
            for (let i = readyForCleanse.length - 1; i >= 0; i--) {
                if (readyForCleanse[i].statusTurn < 4) {
                    readyForCleanse.splice(i, 1)
                }
            }
            console.log(readyForCleanse)
            checkPhaseCounter = readyForCleanse.length > 0 ? readyForCleanse[0].slotIndex : 3
            console.log("checkPhaseCounter: ", checkPhaseCounter)
            CleanseFirstCheck = false
        }
        if (readyForCleanse.length > 0 && checkPhaseCounter < 3) {
            innerHTMLFormat("alert-gs", "Status Cleanse Player B")
            ToggleButton("btn-gs", "on")
            DisableTrayButtons((btn = { "btn-gs": () => { return null } }))
            ToggleGridElement("roll-tray-roll-div-id", "off")
            ToggleGridElement("game-start-id", "on")
            innerHTMLFormat("btn-gs", "Cleanse dice")
            waitButton("btn-gs", () => {
                innerHTMLFormat("alert-gs", `Rolling ${dicesB[checkPhaseCounter].name} to cleanse ${dicesB[checkPhaseCounter].status} on Player b's ${dicesB[checkPhaseCounter].name} (${dicesB[checkPhaseCounter].statusCleanse} or more)`)
                innerHTMLFormat("btn-gs", `Roll ${dicesB[checkPhaseCounter].name}`)
                waitButton("btn-gs", () => {
                    ToggleButton("btn-gs", "off")
                    Roll(dicesB[checkPhaseCounter].name)
                    innerHTMLFormat("alert-gs", rollD)
                    if (rollD >= (dicesB[checkPhaseCounter].statusCleanse)) {
                        innerHTMLFormat("alert-b", `${dicesB[checkPhaseCounter].status} cleansed`)
                        innerHTMLFormat(`dice-type-${checkPhaseCounter + 1}-b`, dicesB[checkPhaseCounter].name)
                        ChangeTextColor(`dice-type-${checkPhaseCounter + 1}-b`, "#a0c25b", "no")
                        if (dicesB[checkPhaseCounter].status == "Venom") {
                            vdiceB[checkPhaseCounter] = false
                        } else if (dicesB[checkPhaseCounter].status == "Burned") {
                            fdiceB[checkPhaseCounter] = false
                        }
                        dicesB[checkPhaseCounter].status = "Normal"
                        dicesB[checkPhaseCounter].statusTurn = 0
                    } else {
                        innerHTMLFormat("alert-b", `Cleanse Failed!`)
                    }
                    if (checkPhaseCounter == 0 && dicesB[checkPhaseCounter + 1].statusTurn >= 3) {
                        checkPhaseCounter = 1
                    } else if (checkPhaseCounter == 1 && dicesB[checkPhaseCounter + 1].statusTurn >= 3) {
                        checkPhaseCounter = 2
                    } else {
                        checkPhaseCounter = 3
                    }
                    setTimeout(() => {
                        innerHTMLFormat("alert-b", "")
                        CleanseStatusPhase();
                    }, gameTimerPause);
                })
            })
        } else {
            ToggleGridElement("roll-tray-roll-div-id", "on")
            ToggleGridElement("game-start-id", "off")
            checkPhaseCounter = 0
            CleanseFirstCheck = true
            FinalPhase()
        }
    } else {
        ToggleGridElement("roll-tray-roll-div-id", "on")
        ToggleGridElement("game-start-id", "off")
        checkPhaseCounter = 0
        CleanseFirstCheck = true
        FinalPhase()
    }
}

function FinalPhase(params) {
    vdice = false
    fdice = false
    specialD = false
    specialH = false
    cordice = 0
    gameRound++
    statCheckStartA = true
    statCheckStartB = true
    ToggleAllButtons("all", "on")
    innerHTMLFormat("alert-a", "")
    innerHTMLFormat("alert-b", "")
    CheckWinner()
}
/*TO DO
 
    *Acabar FinalPhase() para cambiar el turno y resetear todos los booleanos de ataque
 
    *Borrar tablero cada que se cambia de fase completa (fase 1 y 2 se cuenta como una sola fase)
 
    *Agregar una funcion de daño en la que se meta la formula de daño y dentro de la funcion ponga el efecto de ir 
    contando el daño de uno en uno, incrementar el tamaño de la letra, cambiar el color el tipo de daño (rojo para 
    daño normal, verde para daño de veneno y naranja para daño de quemado) y despues de como return el daño total
    para que se asigne a la variable de vida.
 
    *Implementar una funcion que cuente los puntos de vida totales de cada jugador. si el resultado es 0, el jugador 
    contrario gana. implementar esta funcion antes de la fase de check de estados y despues de esta
*/

document.addEventListener("DOMContentLoaded", function () {
    StartGame();
})

document.addEventListener('keydown', function (event) {
    // Verifica si se presionó la tecla "Enter"
    if (event.key === 'Enter') {
        // Obtén el botón por su ID y simula un clic
        document.getElementById('btn-gs').click();
    }
});