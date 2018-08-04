$(document).ready(initializeGame);

var currentState = "getPlayer1Name";
var currentPlayer = 0;
var gamesPlayed=1;
var turnCounter=0;
var first_card_clicked=null;
var second_card_clicked=null;
var indexClick={
    firstClick:null,
    secondClick:null,
};
var soundToggle=false;
var victory=new Audio("victory.mp3");
var theme=new Audio("theme.mp3");
var playerColor=["backCardBlue","backCardRed"];
var playerThatWon=[".GamesWon1",".GamesWon2"];
var pokemons=[
    {image:"arcanine",number:1,flipped:false},{image:"arcanine",number:1,flipped:false},{image:"charzard",number:2,flipped:false},{image:"charzard",number:2,flipped:false},
    {image:"moltres",number:3,flipped:false},{image:"moltres",number:3,flipped:false},{image:"pickacu",number:4,flipped:false}, {image:"pickacu",number:4,flipped:false},
    {image:"squirtle",number:5,flipped:false},{image:"squirtle",number:5,flipped:false},{image:"sandshrew",number:6,flipped:false},{image:"sandshrew",number:6,flipped:false},
    {image:"bulbasaur",number:7,flipped:false},{image:"bulbasaur",number:7,flipped:false},{image:"psyduck",number:8,flipped:false},{image:"psyduck",number:8,flipped:false},
    {image:"magikarp",number:9,flipped:false},{image:"magikarp",number:9,flipped:false}
];


var players = [
    { pokemon: null, name: "", health: 100,gamesWon:0,playersFirstTurn:true,peakCount:0,playersPeaks:[null,null,null],accuracy:0,match:0,attempts:0,pokemonShuffle:$.extend(true,[],pokemons)},
    { pokemon: null, name: "", health: 100,gamesWon:0,playersFirstTurn:true,peakCount:0,playersPeaks:[null,null,null],accuracy:0,match:0,attempts:0,pokemonShuffle:$.extend(true,[],pokemons)}
]
var selectedPokemon=[{ class:"battlePokemon1",src:"https://img.pokemondb.net/sprites/black-white/anim/shiny/arcanine.gif"},
    {class:"battlePokemon2", src:"https://img.pokemondb.net/sprites/black-white/anim/shiny/charizard.gif"},
    {class:"battlePokemon3" ,src:"https://img.pokemondb.net/sprites/black-white/anim/shiny/moltres.gif" }
];


function initializeGame(){
   ;
    $(".input-button").on("click", modalInput);
    $(".pokemon-row > div").on("click", modalInput);
    $(".reset").on("click",reset);
    $(".about").on("click",about);
    $(".sneakPeak").on("click" ,".Peak",sneakPeak);
    $(".toggleSound").on("click", toggleSound);

}


function modalInput() {

    switch(currentState){
        case 'getPlayer1Name':
            if ($(".input-field").val() == "") {
                $(".modal_text").text("Invalid Name Try again");

            } else {
                players[currentPlayer].name = $(".input-field").val();
                pickPokemonModal(players[currentPlayer].name);
                currentState="getPlayer1Pokemon";
            }
            break;
        case 'getPlayer1Pokemon':
            $(this).css("border","4px solid blue");
            setTimeout(()=>{
                players[currentPlayer].pokemon = parseInt($(this).attr('data-target'));
                pickPlayerName("Player 2");
                currentState = 'getPlayer2Name';
                populateGameData(".player1Name",currentPlayer,".pokemonAnimation1");
                shufflePokemon(players[currentPlayer].pokemonShuffle);
                currentPlayer++;
            },500)
            
           
            break;
        case 'getPlayer2Name':
            if ($(".input-field").val() == "") {
                $(".modal_text").text("Invalid Name Try again");

            } else {
                players[currentPlayer].name = $(".input-field").val();
                pickPokemonModal(players[currentPlayer].name);
                currentState = 'getPlayer2Pokemon'
            }
            break;
        case 'getPlayer2Pokemon':


            $(this).css("border","4px solid red");
            players[currentPlayer].pokemon = parseInt($(this).attr('data-target'));
            setTimeout(()=>{
                $(".modal").hide();
                $(".content").removeClass('hide');
                populateGameData(".player2Name",currentPlayer,".pokemonAnimation2");
                shufflePokemon(players[currentPlayer].pokemonShuffle);
                currentPlayer--;
                playerBoard();
                toggleSound();
            },500);
            
            break;
    }

}

function toggleSound(){
if(!soundToggle){
    soundToggle=true;
    theme.play();
    theme.volume=0.005;
}else{
    soundToggle=false;
    theme.pause();
 }
}
function pickPlayerName(playerID){
    $(".input-field").val("");
    $(".pokemon-row").css("display","none");
    $(".modal_text").text(playerID + " what is your name?");
    $(".direction").text("Click Pokeball to continue...");
    $(".playerinput").removeClass("hide");
}


function pickPokemonModal(Player) {
    $(".modal_text").text(Player+" pick your pokemon");
    $(".direction").text("Select Your Pokemon");
    $(".playerinput").addClass("hide");
    $(".pokemon-row").css("display","block");
}
function playerBoard() {
    
    
    if(players[currentPlayer].playersFirstTurn){
            for(var x=0;x<players[currentPlayer].pokemonShuffle.length;x++) {
                players[currentPlayer].pokemonShuffle[x].flipped = true;
            }
        players[currentPlayer].playersFirstTurn = false;
        populateBoard(players[currentPlayer].pokemonShuffle);
        setTimeout(playerBoard,2000);

    }else{
        for(var i=0;i<players[currentPlayer].pokemonShuffle.length;i++) {
            players[currentPlayer].pokemonShuffle[i].flipped = false;
        }
        populateBoard(players[currentPlayer].pokemonShuffle);
    }
}

function populateGameData(playerID,currentPlayer,playerPokemon){

    $(playerID).text(players[currentPlayer].name);
    if($(window).width()>=700){
    $(playerPokemon).append($("<div>",{

        class:"centerPokemonImg "+selectedPokemon[players[currentPlayer].pokemon].class
    }));
}else{
    $(playerPokemon).append($("<div>",{

        class:selectedPokemon[players[currentPlayer].pokemon].class
    }));
}
    

}
function shufflePokemon(array) {

    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function populateBoard(playerID){

    $(".currentPlayer").text(players[currentPlayer].name);
    $(".gameArea").html("");
    var gameBoard=$(".gameArea");

    for(var x=0;x<playerID.length;x++){
        var cards=$("<div>",{class:"cards pickCard"});
        var backcardsContent=$("<div>",{class:"backCardImg"});
        var frontCardContent=$("<div>",{class:"frontCardImg "+playerID[x].image});
        switch(""+playerID[x].flipped+""){

            case "false":
                cards.addClass(playerColor[currentPlayer]);
                cards.append(backcardsContent);
                gameBoard.append(cards);
                break;
            case "true":
                cards.addClass("frontCard");
                cards.append(frontCardContent);
                gameBoard.append(cards);

        }

    }
    $(".gameArea>.pickCard").on("click",pickCards);
}
function about(){
    $(".aboutModal").removeClass("hide");
    $(".aboutModal").on("click",function(){
        $(".aboutModal").addClass("hide");
    });
}
function pickCards(){
if(indexClick.firstClick !==null&& indexClick.secondClick!==null){
    return;
}

     switch (indexClick.firstClick==null){
         case true:

             firstCard(this);

             break;

         case false:
             secondCard(this);
             break;
     }

}
function firstCard(location){
    indexClick.firstClick=parseInt($(".gameArea>.pickCard").index(location));
    first_card_clicked = players[currentPlayer].pokemonShuffle[indexClick.firstClick];
    if(players[currentPlayer].pokemonShuffle[indexClick.firstClick].flipped==true){
        first_card_clicked=null;
        indexClick.firstClick=null;
        return;
    }else{
        first_card_clicked.flipped=true;
        flip(location,first_card_clicked);
    }
    
}

function secondCard(location){


       indexClick.secondClick= parseInt($(".gameArea>.pickCard").index(location));
    second_card_clicked = players[currentPlayer].pokemonShuffle[indexClick.secondClick];

    if(players[currentPlayer].pokemonShuffle[indexClick.secondClick].flipped==true){
        second_card_clicked=null;
        indexClick.secondClick=null;
        return;
    }

    if(indexClick.firstClick === indexClick.secondClick){
        indexClick.secondClick=null;
        second_card_clicked =null;
         return;

    }else if(first_card_clicked.number === second_card_clicked.number){
        flip(location,second_card_clicked);
        first_card_clicked.flipped=true;
        second_card_clicked.flipped=true;
        players[currentPlayer].match+=1;
        pickachuCheck();


    }else if(first_card_clicked.number !== second_card_clicked.number){

        flip(location,second_card_clicked);
       var unflip=setTimeout(unFlip,1500);

    }
    players[currentPlayer].attempts+=1;
    accuracy();

}
function accuracy(){
    players[currentPlayer].accuracy=Math.floor((players[currentPlayer].match/players[currentPlayer].attempts)*100);
    $(".accuracy").text(players[currentPlayer].accuracy);
}
function playerTurnScreen(){

    $(".modal").html("");
    currentPlayer=-currentPlayer +1;
    
    var modalPlayerText=$("<div>",{class:"modalPlayerText",
        text:players[currentPlayer].name+"'s Turn"
    }); 
    var modalContainer=$("<div>",{class:"modalPlayerTurn"});
    var modalClass="modal"+selectedPokemon[players[currentPlayer].pokemon].class.substring(6);
    var innerModalContainer=$("<div>",{class:"modalPlayerPokemonBox "+ modalClass});
    $(modalContainer).append(modalPlayerText);
    modalContainer.append(innerModalContainer);
    $(".modal").append(modalContainer);
    $(".modal").show();
    $(".modal").addClass("animated slideInDown");
    
    var nextPlayer=setTimeout(function(){
        resetVariables();
    },1550);


    var hideModalTimer=setTimeout(function(){
       $(".modal").hide();
    },1600);
}
function pickachuCheck(){
    if(first_card_clicked.number==4 && second_card_clicked.number==4){

        $(".cards").removeClass("animateds flipInY")
       $(".cards").addClass("animated2s shake");
        opponentHit(30);

    }else{
        opponentHit(13);
    }
}
function opponentHit(amount){
    var correct;
    var modalPLayerTurn;
    switch (currentPlayer){
        case 0:
            if(players[1].health<=amount){
                makeHitPoints("noOpponentHealth",amount);
                setTimeout(winner,2200);
            }else{
                makeHitPoints("OpponentHealth",amount);
                modalPLayerTurn=setTimeout(playerTurnScreen,2200);
            }
        break;

        case 1:
            if(players[0].health<=amount){
                makeHitPoints("noOpponentHealth",amount);
                setTimeout(winner,2200);
            }else{
                makeHitPoints("OpponentHealth",amount);
                modalPLayerTurn=setTimeout(playerTurnScreen,2200);
            }
        break;

    }
}
function makeHitPoints(currentOpponentHealth,amount){

    var health=[".health1",".health2"];
    var playerHit=currentPlayer;
    playerHit= -playerHit+1;
    var start =0;
    function hitPointCountdown() {
        switch (currentOpponentHealth) {
            case "noOpponentHealth":

                if (players[playerHit].health > 0) {
                    $(health[playerHit]).text(players[playerHit].health -= 1);
                }else{clearInterval(stopHitPoint);}
                break;
            case "OpponentHealth":

                if (start < amount) {
                    $(health[playerHit]).text(players[playerHit].health -= 1);
                    start++;
                }else{clearInterval(stopHitPoint);}
                break;
        }
    }
    var stopHitPoint=setInterval(hitPointCountdown,70);
}
function winner(){
    theme.pause();
    theme.currentTime = 0;
    victory.play();
    victory.volume=0.05;
    $(".modal").show();
    $(".gameAmount").text(gamesPlayed+=1);
    $(playerThatWon[currentPlayer]).text(players[currentPlayer].gamesWon+=1);
    var modalPlayerText=$(".modalPlayerText").text(players[currentPlayer].name+" Wins");
    var playButton=$("<button>",{class:"playerWon btn btn-outline-primary btn-lg",text:"Play Again"});
    $(".modalPlayerTurn").append(playButton);
    $(".playerWon").on("click",playAgain);
    currentPlayer=0;


}
function flip(cardBeingFlipped,index){
    var card = $(cardBeingFlipped);
 card.removeClass(playerColor[currentPlayer]);
 card.addClass("frontCard animateds flipInY");
 card.children().removeClass("backCardImg");
 card.children().addClass("frontCardImg "+index.image);




}
function unFlipPeak(flipback,flipTrueCheck){
      
        if(!flipTrueCheck){
            $(flipback).addClass(`${playerColor[currentPlayer]} animateds flipInY`);
            $(flipback).children().removeClass().addClass("backCardImg");
            $(flipback).removeClass("frontCard");
        };
    }
function unFlip() {
first_card_clicked.flipped=false;
var card=".gameArea .cards:nth-child(";
var card1=card+(indexClick.firstClick+1)+")";
var card2=card+(indexClick.secondClick+1)+")";
    $(card1).removeClass("animateds flipInY");
    $(card2).removeClass("animateds flipInY");

setTimeout(()=>{
    $(card1).addClass(`${playerColor[currentPlayer]} animateds flipInY`);
    $(card2).addClass(`${playerColor[currentPlayer]} animateds flipInY`);
 
    $(card1).children().removeClass().addClass("backCardImg");
    $(card2).children().removeClass().addClass("backCardImg");
    $(card1).removeClass("frontCard");
    $(card2).removeClass("frontCard");
    
    
},300);


var waitToShowPlayerTurnScreen=setTimeout(playerTurnScreen,1000);

}

function sneakPeak(e){
    if(players[currentPlayer].peakCount !==3 && !$(e.target).hasClass("clicked")){
       
        $(e.target).addClass("clicked");
        $(e.target).css("opacity","0.3");
      players[currentPlayer].playersPeaks[players[currentPlayer].peakCount]=e.target;
      for(let x=0;x<$(".gameArea>.pickCard").length;x++){
        flip($(".gameArea>.pickCard")[x],players[currentPlayer].pokemonShuffle[x]);
        }
      setTimeout(()=>{
        for(let x=0;x<$(".gameArea>.pickCard").length;x++){
            unFlipPeak($(".gameArea>.pickCard")[x],players[currentPlayer].pokemonShuffle[x].flipped);
            }
      },3000);
      players[currentPlayer].peakCount++;
                

    }
}

function resetVariables(){
    var x=0;
    $(".Peak").removeClass("clicked");
    $(".Peak").css("opacity",1);
    first_card_clicked=null;
    second_card_clicked=null;
    indexClick.firstClick=null;
    indexClick.secondClick=null;
    $(".accuracy").text(players[currentPlayer].accuracy);

    while(players[currentPlayer].playersPeaks[x]!==null && x!==3){
        $(players[currentPlayer].playersPeaks[x]).addClass("clicked");
        $(players[currentPlayer].playersPeaks[x]).css("opacity","0.3");
        x++;
    }
    playerFirstTurn();
}
function playerFirstTurn(){
    if(turnCounter<=0){
        playerBoard();
        turnCounter++;
    }else {
        populateBoard(players[currentPlayer].pokemonShuffle);
    }
}
function reset(){
    currentPlayer=0;
    $(".gameAmount").text(gamesPlayed+=1);
    playAgain();
}
function playAgain(){
 
  players[currentPlayer].accuracy=0;
  players[currentPlayer].match=0;
  players[currentPlayer].attempts=0;
  $(".Peak").removeClass("clicked");
  $(".Peak").css("opacity","1");
    for(var x=0;x<players[currentPlayer].pokemonShuffle.length;x++){
               players[currentPlayer].pokemonShuffle[x].flipped=false;
    }
        switch (currentPlayer){
        case 0:
            $(".accuracy").text(0);
            $(".health1").text(players[currentPlayer].health=100);
            shufflePokemon(players[currentPlayer].pokemonShuffle);
            players[currentPlayer].playersFirstTurn=true;
            for(var change1=0;change1<players[currentPlayer].playersPeaks.length;change1++){
                players[currentPlayer].playersPeaks[change1]=null;
            }
            currentPlayer++;
            playAgain();
            break
        case 1:
            for(var change2=0;change2<players[currentPlayer].playersPeaks.length;change2++){
                players[currentPlayer].playersPeaks[change2]=null;
            }
            players[currentPlayer].playersFirstTurn=true;
            $(".health2").text(players[currentPlayer].health=100);
            shufflePokemon(players[currentPlayer].pokemonShuffle);
            currentPlayer--;
            resetVariables();
            victory.pause();
            victory.currentTime=0;
            var hideModalTimer=setTimeout(function(){
                $(".modal").hide();
                turnCounter=0;
                playerBoard();
            },1500);
    }

}

