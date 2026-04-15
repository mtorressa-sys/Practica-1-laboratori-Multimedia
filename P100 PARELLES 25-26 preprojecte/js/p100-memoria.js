var ampladaCarta, alcadaCarta;
var separacioH=20, separacioV=20;
var nFiles=1, nColumnes=1;

var jocCartes = [
    'carta14', 
];


$(function(){
    var f, c, carta;
    f=1;
    c=1;

 

    ampladaCarta=$(".carta").width(); 
    alcadaCarta=$(".carta").height();
    // mida del tauler
    $("#tauler").css({
        "width" : "120px",
        "height": "160px"
    });

    carta=$("#f"+f+"c"+c);
    carta.css({
        "left" :  ((c-1)*(ampladaCarta+separacioH)+separacioH)+"px",
        "top"  :  ((f-1)*(alcadaCarta+separacioV) +separacioV)+"px"
    });
    carta.find(".davant").addClass(jocCartes.pop());
   
    $(".carta").on("click",function(){
        $(this).toggleClass("carta-girada");
    });

});