var ampladaCarta, alcadaCarta;
var separacioH=20, separacioV=20;
var nFiles=4, nColumnes=4;

var jocCartes = [
    'carta1','carta1',
    'carta2','carta2',
    'carta3','carta3',
    'carta4','carta4',
    'carta5','carta5',
    'carta6','carta6',
    'carta7','carta7',
    'carta8','carta8'
];

$(function(){
    var f, c, carta;

    ampladaCarta=$(".carta").width(); 
    alcadaCarta=$(".carta").height();

    // mida del tauler adaptada a files i columnes
    $("#tauler").css({
        "width" : (nColumnes*(ampladaCarta+separacioH)+separacioH)+"px",
        "height": (nFiles*(alcadaCarta+separacioV)+separacioV)+"px"
    });

    // posicionar cartes segons files i columnes
    for(f=1; f<=nFiles; f++){
        for(c=1; c<=nColumnes; c++){
            carta=$("#f"+f+"c"+c);

            carta.css({
                "left" : ((c-1)*(ampladaCarta+separacioH)+separacioH)+"px",
                "top"  : ((f-1)*(alcadaCarta+separacioV)+separacioV)+"px"
            });

            carta.find(".davant").addClass(jocCartes.pop());
        }
    }

    $(".carta").on("click",function(){
        $(this).toggleClass("carta-girada");
    });

});