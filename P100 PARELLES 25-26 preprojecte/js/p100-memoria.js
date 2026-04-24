var ampladaCarta = 79; 
var alcadaCarta = 123;
var separacioH = 20; 
var separacioV = 20;

$(function(){
    $("#btn-iniciar").on("click", function() {
        var numCartes = parseInt($("#nivell").val()); 
        generarTauler(numCartes);
    });
});

function generarTauler(numCartes) {
    $("#tauler").empty();

    var costat = Math.sqrt(numCartes);

    var ampladaTotal = (costat * ampladaCarta) + ((costat + 1) * separacioH);
    var alcadaTotal = (costat * alcadaCarta) + ((costat + 1) * separacioV);

    $("#tauler").css({
        "width" : ampladaTotal + "px",
        "height": alcadaTotal + "px"
    });

    for (var f = 1; f <= costat; f++) {
        for (var c = 1; c <= costat; c++) {
            
            var carta = $('<div class="carta"> <div class="cara darrera"></div><div class="cara davant"></div> </div>');
            
            var posX = ((c - 1) * (ampladaCarta + separacioH) + separacioH);
            var posY = ((f - 1) * (alcadaCarta + separacioV) + separacioV);
            
            carta.css({
                "left" : posX + "px",
                "top"  : posY + "px"
            });

            carta.find(".davant").addClass("carta14");
            
            $("#tauler").append(carta);
        }
    }

    $(".carta").on("click", function(){
        $(this).toggleClass("carta-girada");
    });
}