var ampladaCarta, alcadaCarta;
var separacioH=20, separacioV=20;

//modifica per canviar la mida del taulell
var nFiles=4
var nColumnes=4;

var jocCartes = [
    'carta1',  'carta2',  'carta3',  'carta4',
    'carta5',  'carta6',  'carta7',  'carta8',
    'carta9',  'carta10', 'carta11', 'carta12',
    'carta13', 'carta14', 'carta15', 'carta16',
    'carta17', 'carta18', 'carta19', 'carta20',
    'carta21', 'carta22', 'carta23', 'carta24',
    'carta25', 'carta26'
];

function barreja(arr) {
    var a = arr.slice(); // còpia per no modificar l'original
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
}

function generaTauler() {

    // Barreja i selecciona les parelles necessàries
    var totalCartes     = nFiles * nColumnes;
    var barrejades      = barreja(jocCartes);
    var seleccionades   = barrejades.slice(0, totalCartes / 2);
    var ambParelles     = barreja(seleccionades.concat(seleccionades));

    // Agafa mides de la carta (existeix al CSS)
    // Fem servir una carta temporal per llegir-ne les mides
    var cartaTemp = $('<div class="carta" style="visibility:hidden"></div>').appendTo("body");
    ampladaCarta  = cartaTemp.width();
    alcadaCarta   = cartaTemp.height();
    cartaTemp.remove();

    // Mida del tauler
    $("#tauler").css({
        "width" : (nColumnes * (ampladaCarta + separacioH) + separacioH) + "px",
        "height": (nFiles    * (alcadaCarta  + separacioV) + separacioV) + "px"
    });

    // Buidar tauler
    $("#tauler").empty();

    // Crear cartes
    var index = 0;
    for (var f = 1; f <= nFiles; f++) {
        for (var c = 1; c <= nColumnes; c++) {

            var idCarta = "f" + f + "c" + c;

            $("#tauler").append(
                '<div class="carta" id="' + idCarta + '">' +
                    '<div class="cara davant"></div>' +
                    '<div class="cara darrera"></div>' +
                '</div>'
            );

            var $carta = $("#" + idCarta);

            $carta.css({
                "left": ((c - 1) * (ampladaCarta + separacioH) + separacioH) + "px",
                "top" : ((f - 1) * (alcadaCarta  + separacioV) + separacioV) + "px"
            });

            // Assigna la figura (classe CSS) a la cara del davant
            $carta.find(".davant").addClass(ambParelles[index]);
            // Guarda el nom de la figura com a data per comparar després
            $carta.data("figura", ambParelles[index]);

            index++;
        }
    }

    $(".carta").on("click", function () {
        $(this).toggleClass("carta-girada");
    });
}

$(function () {

    // Botó iniciar: llegeix el select i genera el tauler
    $("#btn-iniciar").on("click", function () {
        var valor = $("#select-nivell").val().split("-");
        nFiles    = parseInt(valor[0]);
        nColumnes = parseInt(valor[1]);
        generaTauler();
    });

    // Genera el tauler per defecte amb els valors inicials de 1a
    generaTauler();
});