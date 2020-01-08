$(function() {
    $("#headerText").text(headerText);
    $("#instruction").css({
        color: headerInstructionColor
    });
    // $("#instruction").text(Instruction);
    $('body').css({
        'background-image': bg
    });
    let output = $('.output');
    let didCorrect = 0;
    $('#nextLevel').attr('disabled','disabled');
    generateQuestion();
    dragDrop();


    //function to generate the question
    function generateQuestion() {
        let randNumber;
        let html;
        let rand1;
        let rand2;
        let match = true;
        let optionRand;

        $('.questContainer').empty();
        $('.numContainer').empty();


        for (let i = 0; i < 3; i++) {
            rand2 = Math.floor(Math.random() * (max - min) + 1) + min;
            // optionRand =  Math.floor(Math.random() * (max - min) + 1) + min;

            if (rand2 == randNumber) {
                randNumber + 1;
                // console.log('match')
                if (match == true) {
                    randNumber = randNumber + 1;
                    match == false;
                } else {
                    randNumber = randNumber + 2;
                    match == true;
                }
            } else {
                randNumber = rand2;
            }
            // console.log("randNumber", randNumber)
            // randNumber = Math.floor(Math.random() * (max - min) + 1) + min;

            rand1 = randNumber + 1;

            html = `<div class="quest" >
                      <div class="noDrop dropContainer">${randNumber}</div>
                      <div class="drop dropContainer" data-user='' data-ans='${rand1}'></div>
                      <div class="noDrop dropContainer">${randNumber+2}</div>
                  </div>`;
            $('.questContainer').append(html);
            $('.numContainer').append(`<div class="drag">${rand1}</div>`);
        } //end for loop

              for(let i=0; i<2; i++){
            optionRand = Math.floor(Math.random() * (max - min) + 1) + min;
            $('.numContainer').append(`<div class="drag">${optionRand}</div>`);
        }
    }

    // function for drag and drop
    function dragDrop() {

        $('.drag').draggable({
            revert: 'invalid',
            snapMode: 'inner',
            // helper: 'clone'
        });

        $(".drop").droppable({

            accept: ".drag",
            // tolerance: 'intersect',
            drop: function(event, ui) {

                if ($(event.target).attr('data-user') == '') {
                    $(event.target).attr('data-user', ui.draggable.text());
                    ui.draggable.draggable("disable", 1);
                } else {
                    $(ui.draggable).animate({
                        top: "0px",
                        left: "0px"
                    });
                    return false;
                }

                // centering element when drop
                var drop_el = $(this).offset();
                var drag_el = ui.draggable.offset();
                var left_end = (drop_el.left + ($(this).width() / 2)) - (drag_el.left + (ui.draggable.width() / 2));
                var top_end = (drop_el.top + ($(this).height() / 2)) - (drag_el.top + (ui.draggable.height() / 2));
                ui.draggable.animate({
                    top: '+=' + top_end,
                    left: '+=' + left_end
                });
                // centering element when drop end

            } // drop method end here
        });

    } //end here drag and drop 

    function randomsuggestion() {
       
        // for(let i=0; i<3; i++){
            $.each($('.drag'), function(index, value){
                // $(value).css({ 'order': Math.floor(Math.random() * (optionMax - optionMin) + 1) + optionMin });
                $(value).css({ 'order': Math.floor((Math.random() * 5) + 1) });
            })
            // $(('.drag')[i]).css({ 'order': Math.floor((Math.random() * 3) + 1) });
         // }
         console.log('working..')
    }

    randomsuggestion();



    // function for next question
    $('#next').click(function(){
        generateQuestion();
        dragDrop(); 
        randomsuggestion();
        $('#check').show();
        $('#reset').show();
        $('#next').hide();
        $('#showAnswer').hide();
        correctAns = 0;
        chance = 0;
    })
    // function for next question end


    // function to check the answer
    let correctAns = 0;
    let chance = 0;
    let userAns = 0;

    function check() {
        console.log('did Correct', didCorrect)
        correctAns = null;
        $.each($('.drop'), function(index, value) {
            let dataUser = $(value).attr('data-user');
            let dataAns = $(value).attr('data-ans');
            // console.log(dataUser, dataAns);
            if (dataUser == dataAns) {
                // console.log('working...');
                correctAns++;
                $(value).css({'backgroundImage':'url(img/correct.png)'});
            } else {
                $(value).css({'backgroundImage':'url(img/error.png)'})
               
            }
        })

    } // check answer function  end

    $('#check').click(function(){

        let dropLength = $('.drop').length;
        let dropTag = $('.drop');
        let userInput = '';
        $.each(dropTag, function(i, value) {
            let userData = $(value).attr('data-user');
            userInput += userData;
        });

        if (userInput == '') {
            return false;
        }
        check();
        if (correctAns == dropLength) {
            $('#showAnswer').hide();
            $(output[userAns]).css("background-image", "url(" + 'img/happy.png' + ")");
            chance = 0;
            userAns++;
            didCorrect++;
            var audio = new Audio('audio/welldone.mp3');
            audio.play();
     
                $('.wellDone').fadeIn();

                setTimeout(function(){
                        $('.wellDone').fadeOut();
            },1000)
            $('#reset').hide();
            $('#check').hide();
            $('#next').show();
        } else {
            if (chance == 0) {
                chance++;
               var audio2 = new Audio('audio/tryAgain.mp3');
                 audio2.play();
                $('.tryAgain').fadeIn();
                setTimeout(function(){
                         $('.tryAgain').fadeOut();
                },1000)
                return false;
            } else {
                $(this).hide();
                $('#reset').hide();
                $('#showAnswer').show();
                $('#next').show();
                // $(output[userAns]).css("background-image", "url(" + 'img/sad.png' + ")");
                userAns++;
            }

        }
        if (userAns == 5) {
            $('#next').hide();
            $('#playAgain').show();

        }

        if(didCorrect==5){
            $('#nextLevel').removeAttr('disabled');
        }
  })    

    // function to reset the question
    $('#reset').click(function() {
        $('.drag').animate({
            top: "0px",
            left: "0px"
        });
        $('.drop').attr('data-user', '').css({'borderColor':'#ece'});
        $('.drag').draggable("enable", 1);
    }) // end the reset function here

    // play again function
    $('#playAgain').click(function() {
        location.reload();
    })
    // end play agian function

    // show answer function
    $('#showAnswer').click(function() {
        chance = 0;
        $.each($('.drop'), function(index, value) {
            $(this).text($(this).attr('data-ans'));
            $(value).css({'backgroundImage':'url(img/correct.png)'});
        })

        if (userAns == 5) {
            $('#next').hide();
        }else{
            $('#next').show();
        }
       
        $(this).hide();

        
        $('#check').hide();
        $('#reset').hide();
        $('.drag').animate({
                        top: "0px",
                        left: "0px"
                    });
    })  // end show answer function


    $('#nextLevel').click(function(){
        window.location.href='../3/main.html';
    })

}); // end document function