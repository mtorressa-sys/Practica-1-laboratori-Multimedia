var ampladaCarta, alcadaCarta;
var separacioH=20, separacioV=20;

// Sons del joc
var sons = {
    clic:     new Audio('so/clic.mp3'),
    parella:  new Audio('so/parella.mp3'),
    error:    new Audio('so/error.mp3'),
    victoria: new Audio('so/victoria.mp3'),
    derrota:  new Audio('so/derrota.mp3'),
    jugar:    new Audio('so/jugar.mp3'),
    repartir: new Audio('so/repartir.mp3'),
    tictac:   new Audio('so/tictac.mp3'),
    temps:    new Audio('so/temps.mp3')
};

// El tictac va en bucle
sons.tictac.loop = true;

// Posa el so a 0 i fa que comenci
function reprodueixSo(nom) {
    sons[nom].currentTime = 0;
    sons[nom].play();
}

// Atura el so i el posa a 0
function aturarSo(nom) {
    sons[nom].pause();
    sons[nom].currentTime = 0;
}

// Configuració de cada baralla
var baralles = {
    poker1: {
        fitxer: 'poker1.png',
        amplada: 79, alcada: 123,
        maxCartes: 52,
        reversX: 0, reversY: -492,
        cartes: (function() {
            var arr = [];
            for (var i = 0; i < 52; i++) {
                arr.push({ x: -(i % 13) * 79, y: -Math.floor(i / 13) * 123 });
            }
            return arr;
        })()
    },
    baraja: {
        fitxer: 'Baraja_española_completa.png',
        amplada: 208, alcada: 319,
        maxCartes: 48,
        reversX: -208, reversY: -1276,
        cartes: (function() {
            var arr = [];
            for (var i = 0; i < 48; i++) {
                arr.push({ x: -(i % 12) * 208, y: -Math.floor(i / 12) * 319 });
            }
            return arr;
        })()
    },
    card_spritesheet: {
        fitxer: 'card_spritesheet.png',
        amplada: 160, alcada: 252,
        maxCartes: 32,
        reversX: -1280, reversY: -252,
        cartes: (function() {
            var arr = [];
            for (var i = 0; i < 16; i++) {
                arr.push({ x: -(i % 8) * 160, y: -Math.floor(i / 8) * 252 });
            }
            return arr;
        })()
    },
    deck: {
        fitxer: 'deck.png',
        amplada: 80, alcada: 120,
        maxCartes: 52,
        reversX: 0, reversY: -480,
        cartes: (function() {
            var arr = [];
            for (var i = 0; i < 52; i++) {
                arr.push({ x: -(i % 13) * 80, y: -Math.floor(i / 13) * 120 });
            }
            return arr;
        })()
    },
    pokemon: {
        fitxer: 'pokemon.jpg',
        amplada: 111, alcada: 111,
        maxCartes: 46,
        reversX: -777, reversY: 0,
        cartes: (function() {
            var arr = [];
            for (var c = 0; c < 7; c++) arr.push({ x: -c*111, y: 0 });
            for (var c = 0; c < 8; c++) arr.push({ x: -c*111, y: -111 });
            for (var c = 0; c < 8; c++) arr.push({ x: -c*111, y: -222 });
            return arr;
        })()
    },
    pokemon2: {
        fitxer: 'pokemon2.png',
        amplada: 81, alcada: 81,
        maxCartes: 302,
        reversX: null, reversY: null,
        cartes: (function() {
            var arr = [];
            for (var i = 0; i < 151; i++) {
                arr.push({ x: -(i % 16) * 81, y: -Math.floor(i / 16) * 81 });
            }
            return arr;
        })()
    },
    pokemon3: {
        fitxer: 'pokemon3.png',
        amplada: 113, alcada: 113,
        maxCartes: 50,
        reversX: null, reversY: null,
        cartes: (function() {
            var arr = [];
            for (var fil = 0; fil < 5; fil++)
                for (var col = 0; col < 9; col++)
                    arr.push({ x: -(col*114 + 1), y: -(fil*114 + 1) });
            for (var col = 0; col < 5; col++)
                arr.push({ x: -(col*114 + 1), y: -(5*114 + 1) });
            return arr;
        })()
    }
};

// modificables per el taulell inicial
var barallaActual = 'poker1';
var nFiles = 4;
var nColumnes = 4;

function barreja(arr) {
    var a = arr.slice(); // còpia per no modificar l'original
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
}

function actualitzaMarcador() {
    $("#marcador-parelles").text(parellesEliminades);
    $("#marcador-clics").text(totalClics);
    $("#marcador-restants").text(maxClics - totalClics);
}

function actualitzaCompteEnrere() {
    $("#compte-enrere").text(tempsRestant);
    // Canvia color quan queda poc temps (menys d'1/4 del total)
    if (tempsRestant <= Math.floor(tempsTotal / 4)) {
        $("#compte-enrere").addClass("temps-critic");
        reprodueixSo('tictac'); // arrenca el tictac en bucle
    } else {
        $("#compte-enrere").removeClass("temps-critic");
        aturarSo('tictac'); // atura el tictac si encara no és crític
    }
}

function aturarTimer() {
    if (intervalTimer !== null) {
        clearInterval(intervalTimer);
        intervalTimer = null;
    }
    aturarSo('tictac'); // aturem també el tictac
}

function iniciarTimer() {
    aturarTimer(); // per si hi havia un timer anterior actiu
    intervalTimer = setInterval(function () {
        tempsRestant--;
        actualitzaCompteEnrere();
        if (tempsRestant <= 0) {
            aturarTimer();
            esperant = true; // bloquejar més clics
            setTimeout(function () {
                $("#missatge-temps").fadeIn(400);
                reprodueixSo('temps'); // so diferent per derrota per temps
            }, 300);
        }
    }, 1000);
}

function generaTauler() {

    var baralla = baralles[barallaActual];

    // Reiniciem el comptador de parelles i clics
    parellesEliminades = 0;
    totalClics = 0;
    maxClics = nFiles * nColumnes * 3;
    tempsTotal = nFiles * nColumnes * 5; // 5 segons per carta
    tempsRestant = tempsTotal;
    aturarTimer();
    actualitzaMarcador();
    actualitzaCompteEnrere();

    // Barreja i selecciona les parelles necessàries
    var totalCartes = nFiles * nColumnes;
    var seleccionades = barreja(baralla.cartes.slice()).slice(0, totalCartes / 2);
    var ambParelles = barreja(seleccionades.concat(seleccionades));

    // Mides de carta des de la baralla activa
    ampladaCarta = baralla.amplada;
    alcadaCarta = baralla.alcada;

    // Mida del tauler
    $("#tauler").css({
        "width" : (nColumnes * (ampladaCarta + separacioH) + separacioH) + "px",
        "height": (nFiles * (alcadaCarta  + separacioV) + separacioV) + "px"
    });

    // Buidar tauler
    $("#tauler").empty();

    // Posició de la pila (cantonada superior esquerra)
    var pilaLeft = separacioH;
    var pilaTop = separacioV;

    // Pila visual: diverses capes per simular la pila
    var reversStylePila;
    if (baralla.reversX !== null) {
        reversStylePila = 'background: #999 url(images/' + baralla.fitxer + ') ' + baralla.reversX + 'px ' + baralla.reversY + 'px;';
    } else {
        reversStylePila = 'background: #3a5f8a;';
    }
    for (var k = 4; k >= 0; k--) {
        $("#tauler").append(
            '<div class="pila-capa" style="' +
            'position:absolute;' +
            'width:' + ampladaCarta + 'px;height:' + alcadaCarta + 'px;' +
            'left:' + (pilaLeft + k) + 'px;top:' + (pilaTop - k) + 'px;' +
            'border-radius:10px;' +
            reversStylePila +
            '"></div>'
        );
    }

    // So de repartir cartes
    reprodueixSo('repartir');

    // Crear cartes
    var index = 0;
    var cartesCreades = [];

    for (var f = 1; f <= nFiles; f++) {
        for (var c = 1; c <= nColumnes; c++) {

            var idCarta = "f" + f + "c" + c;
            var destLeft = ((c - 1) * (ampladaCarta + separacioH) + separacioH);
            var destTop = ((f - 1) * (alcadaCarta  + separacioV) + separacioV);
            var figura = ambParelles[index];

            // Estil del revers: sprite o color
            var reversStyle;
            if (baralla.reversX !== null) {
                reversStyle = 'background: #999 url(images/' + baralla.fitxer + ') ' + baralla.reversX + 'px ' + baralla.reversY + 'px;';
            } else {
                reversStyle = 'background: #3a5f8a;';
            }

            // Estil de la carta davant
            var davantStyle = 'background: #999 url(images/' + baralla.fitxer + ') ' + figura.x + 'px ' + figura.y + 'px;';

            $("#tauler").append(
                '<div class="carta" id="' + idCarta + '">' +
                    '<div class="cara davant" style="' + davantStyle + '"></div>' +
                    '<div class="cara darrera" style="' + reversStyle + '"></div>' +
                '</div>'
            );

            var $carta = $("#" + idCarta);

            // Posició inicial: pila (cantonada)
            $carta.css({
                "width": ampladaCarta + "px",
                "height": alcadaCarta  + "px",
                "left": pilaLeft + "px",
                "top": pilaTop  + "px",
                "opacity": 0,
                "transition": "none"
            });

            // Guardem coordenades de la figura per comparar parelles
            $carta.data("figura", figura.x + "," + figura.y);
            $carta.data("dest-left", destLeft);
            $carta.data("dest-top", destTop);

            cartesCreades.push($carta);
            index++;
        }
    }

    // les cartes volen des de la pila cap a la seva posició
    cartesCreades.forEach(function($carta, i) {
        setTimeout(function() {
            $carta.css({ "opacity": 1, "transition": "none" });
            setTimeout(function() {
                $carta.css({
                    "transition": "left 0.4s ease, top 0.4s ease",
                    "left": $carta.data("dest-left") + "px",
                    "top": $carta.data("dest-top")  + "px"
                });
            }, 30);
        }, i * 60);
    });

    // Esperar que acabi l'animació abans d'activar els events
    var tempsAnimacio = cartesCreades.length * 60 + 500;
    setTimeout(function() {
        // Eliminem la pila visual un cop totes les cartes han volat
        $(".pila-capa").fadeOut(300, function() { $(this).remove(); });
        aturarSo('repartir'); // aturem el so de repartir
        iniciarEvents();
    }, tempsAnimacio);
}

var primeraCarta = null; // primera carta girada
var esperant = false; // bloqueig mentre gira la segona carta
var parellesEliminades = 0; // comptador de parelles trobades
var totalClics = 0; // comptador de clics fets
var maxClics = 0; // màxim de clics permesos (triple de cartes)
var tempsTotal = 0; // temps total de la partida en segons
var tempsRestant = 0; // temps restant en segons
var intervalTimer = null; // referència al setInterval del timer

function iniciarEvents() {

    $(".carta").on("click", function () {

        // Si estem esperant o la carta ja està girada o eliminada, ignorar clic
        if (esperant) return;
        if ($(this).hasClass("carta-girada")) return;
        if ($(this).hasClass("carta-eliminada")) return;

        $(this).addClass("carta-girada");

        // So de clic en girar la carta
        reprodueixSo('clic');

        // Comptem el clic i actualitzem el marcador
        totalClics++;
        actualitzaMarcador();

        // Comprovem si l'usuari ha superat el màxim de clics (derrota)
        if (totalClics >= maxClics) {
            aturarTimer();
            setTimeout(function () {
                $("#missatge-derrota").fadeIn(400);
                reprodueixSo('derrota');
            }, 600);
            esperant = true; // bloquejar més clics
            return;
        }

        if (primeraCarta === null) {
            // Primera carta: arranquem el timer i guardem referència
            iniciarTimer();
            primeraCarta = $(this);

        } else {
            // Segona carta: comprovem si és la mateixa figura
            esperant = true; // bloquegem nous clics mentre comprovem

            var figura1 = primeraCarta.data("figura");
            var figura2 = $(this).data("figura");

            if (figura1 === figura2) {
                // PARELLA CORRECTA
                // Esperem que acabi de girar i les eliminem
                var $carta1 = primeraCarta;
                var $carta2 = $(this);

                setTimeout(function () {
                    $carta1.addClass("carta-eliminada").fadeOut(400);
                    $carta2.addClass("carta-eliminada").fadeOut(400);
                    reprodueixSo('parella');
                    primeraCarta = null;
                    esperant = false;

                    // Comprovem si és el final de la partida
                    parellesEliminades++;
                    actualitzaMarcador();
                    if (parellesEliminades === (nFiles * nColumnes) / 2) {
                        aturarTimer();
                        setTimeout(function () {
                            $("#missatge-final").fadeIn(400);
                            reprodueixSo('victoria');
                        }, 500);
                    }
                }, 600);

            } else {
                // PARELLA INCORRECTA
                // Esperem que es vegin les dues cartes i les tornem a girar
                var $carta1 = primeraCarta;
                var $carta2 = $(this);

                setTimeout(function () {
                    $carta1.removeClass("carta-girada");
                    $carta2.removeClass("carta-girada");
                    reprodueixSo('error');
                    primeraCarta = null;
                    esperant = false;
                }, 1000);
            }
        }
    });
}

// pantalla de setup

function validaConfiguracio() {
    var barallaTriada = $("#setup-baralla").val();
    var maxC = baralles[barallaTriada].maxCartes;
    var val = parseInt($("#setup-ncartes").val());
    var $err = $("#setup-error");

    if (val < 4) {
        $err.text("El mínim és 4 cartes.").show();
        return false;
    }
    if (val > maxC) {
        $err.text("Aquesta baralla té un màxim de " + maxC + " cartes.").show();
        return false;
    }
    if (val % 2 !== 0) {
        $err.text("El nombre de cartes ha de ser parell.").show();
        return false;
    }
    // Comprovar que té una distribució files/columnes vàlida (producte = val, ambdós > 1)
    var combinacionsValides = combinacionsFiles(val);
    if (combinacionsValides.length === 0) {
        $err.text("No hi ha cap distribució files×columnes vàlida per " + val + " cartes.").show();
        return false;
    }
    $err.hide();
    return true;
}

function combinacionsFiles(total) {
    var valides = [];
    for (var f = 2; f <= total; f++) {
        if (total % f === 0) {
            var c = total / f;
            if (c >= 2) valides.push([f, c]);
        }
    }
    return valides;
}

function triaMillorDistribucio(total) {
    // Escollim la combinació més quadrada possible
    var combinacions = combinacionsFiles(total);
    var millor = combinacions[0];
    var minDif = Math.abs(millor[0] - millor[1]);
    combinacions.forEach(function(comb) {
        var dif = Math.abs(comb[0] - comb[1]);
        if (dif < minDif) { minDif = dif; millor = comb; }
    });
    return millor;
}

function actualitzaMaxCartes() {
    var baralla = $("#setup-baralla").val();
    var max = baralles[baralla].maxCartes;
    var maxTauler = Math.min(max, 302);
    // Arrodonir al parell inferior si és imparell
    if (maxTauler % 2 !== 0) maxTauler--;
    $("#setup-ncartes").attr("max", maxTauler);
    $("#setup-max-info").text("(màx " + maxTauler + " per aquesta baralla)");
    // Validem de nou per actualitzar error si cal
    validaConfiguracio();
}

$(function () {

    // Actualitzar màxim quan canvia la baralla
    $("#setup-baralla").on("change", actualitzaMaxCartes);
    actualitzaMaxCartes();

    // Validació en temps real del camp de text
    $("#setup-ncartes").on("input", validaConfiguracio);

    // Botó Jugar del setup
    $("#btn-jugar").on("click", function () {
        if (!validaConfiguracio()) return;

        // So de jugar
        reprodueixSo('jugar');

        var nCartes = parseInt($("#setup-ncartes").val());
        barallaActual = $("#setup-baralla").val();
        var dist = triaMillorDistribucio(nCartes);
        nFiles = dist[0];
        nColumnes = dist[1];

        // Amaguem setup, mostrem joc
        $("#pantalla-setup").hide();
        $("#pantalla-joc").show();

        primeraCarta = null;
        esperant = false;
        generaTauler();
    });

    // Botons de tornar a jugar -> tornen al setup
    $("#btn-tornar, #btn-tornar-derrota, #btn-tornar-temps").on("click", function () {
        $(this).closest("[id^='missatge']").hide();
        aturarTimer();
        primeraCarta = null;
        esperant = false;
        $("#pantalla-joc").hide();
        $("#pantalla-setup").show();
    });

    // Botó iniciar (dins del joc, per canviar nivell sense tornar al setup)
    $("#btn-iniciar").on("click", function () {
        var valor = $("#select-nivell").val().split("-");
        nFiles = parseInt(valor[0]);
        nColumnes = parseInt(valor[1]);
        primeraCarta = null;
        esperant = false;
        $("#missatge-final").hide();
        $("#missatge-derrota").hide();
        $("#missatge-temps").hide();
        generaTauler();
    });
});