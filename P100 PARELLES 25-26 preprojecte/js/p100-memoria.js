var ampladaCarta, alcadaCarta;
var separacioH=20, separacioV=20;
var nFiles=4, nColumnes=4;

var jocCartes = [
    'carta1',  'carta2',  'carta3',  'carta4',
    'carta5',  'carta6',  'carta7',  'carta8',
    'carta9',  'carta10', 'carta11', 'carta12',
    'carta13', 'carta14', 'carta15', 'carta16',
    'carta17', 'carta18', 'carta19', 'carta20',
    'carta21', 'carta22', 'carta23', 'carta24',
    'carta25', 'carta26'
];

$(function(){
    var f, c, carta;

    // barreja cartes
    jocCartes.sort(function() { return 0.5 - Math.random() });

    // cartes necessaries
    var seleccionades = jocCartes.slice(0, (nFiles * nColumnes) / 2);

    // parelles i seleccionades
    var cartesSeleccionades = seleccionades.concat(seleccionades);
    cartesSeleccionades.sort(function() { return 0.5 - Math.random() });

    ampladaCarta=$(".carta").width(); 
    alcadaCarta=$(".carta").height();

    // mida del tauler
    $("#tauler").css({
        "width" : (nColumnes*(ampladaCarta+separacioH)+separacioH)+"px",
        "height": (nFiles*(alcadaCarta+separacioV)+separacioV)+"px"
    });

    //buidar taulell
    $("#tauler").empty();
    
    // CREAR totes les cartes
    for(f=1; f<=nFiles; f++){
        for(c=1; c<=nColumnes; c++){

            $("#tauler").append(
                '<div class="carta" id="f'+f+'c'+c+'">'+
                    '<div class="cara davant"></div>'+
                    '<div class="cara darrera"></div>'+
                '</div>'
            );

            carta=$("#f"+f+"c"+c);

            carta.css({
                "left" : ((c-1)*(ampladaCarta+separacioH)+separacioH)+"px",
                "top"  : ((f-1)*(alcadaCarta+separacioV)+separacioV)+"px"
            });

            //parelles seleccionades
            var finalistes = cartesSeleccionades.pop();
            carta.find(".davant").addClass(finalistes);
        }
    }

    $(".carta").on("click",function(){
        $(this).toggleClass("carta-girada");
    });

});