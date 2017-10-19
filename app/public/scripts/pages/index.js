$(document).ready(function(){
    if(window.localStorage['Id'].length>1){
        //remember id 여부를 판별한다.
        $('.login_email').val(window.localStorage['Id'])
        //remember id가 체크되어있다면 기억해둔 id를 불러온다
        $('.login_password').focus();
        //password 입력창으로 focus를 넘긴다
        $(".login_remind_check").attr('checked', true)
        //checkbox에 체크한다
    }else{
        $('.login_email').focus();
        //email 입력창으로 focus를 넘긴다
    }
})

$(document).keydown(function(){
    if( event.keyCode == 8 || event.keyCode == 46 ){
        //backspace나 delete를 누름
        checkInput();
        $('.login_wrong').addClass('hidden');
        $('.login_email').removeClass('input_wrong');
        $('.login_password').removeClass('input_wrong');
    }
})

$('.login_password').keydown(function(){
    if(event.keyCode === 13){
        logIn();
    }
})

$('.login_email').keyup(function(){
    checkInput();
})
$('.login_password').keyup(function(){
    checkInput();
})
$('.login_btn').click(function(){
    logIn();
})
let validId = "master2@gmail.com";
let validPass = "master1234";


function checkInput(){
    let regEmail = /\S+@[^.\s]+\.[^.\s]+/;
    if(regEmail.test($('.login_email').val())&&$('.login_password').val().length>3){
        $('.login_btn').removeClass('login_btn_disabled');
        $('.login_btn').addClass('login_btn_enabled');
    }else{
        $('.login_btn').addClass('login_btn_disabled');
        $('.login_btn').removeClass('login_btn_enabled');
    }
}

function logIn(){
    //rememberId여부 체크
    if($(".login_remind_check").is(":checked")){
        window.localStorage['Id'] = $('.login_email').val();
    }else{
        window.localStorage['Id'] = ''
    }

    let mail = $('.login_email').val();
    let pass = $('.login_password').val();

    if(validId === mail){
        //ID는 일치함
        if(validPass === pass){
            //로그인 성공
            $('.login_wrong').addClass('hidden');
            $('.login_email').removeClass('input_wrong');
            $('.login_password').removeClass('input_wrong');

            location.href = './exception.html'

        }else{
            //패스워드 오류
            $('.login_email').removeClass('input_wrong');
            $('.login_password').addClass('input_wrong');
            $('.login_wrong').html('incorrect Password')
            $('.login_wrong').removeClass('hidden');

        }
    }else{
        //id 오류
        $('.login_email').addClass('input_wrong');
        $('.login_wrong').html('incorrect ID')
        $('.login_wrong').removeClass('hidden');
        $('.login_password').removeClass('input_wrong');

    }

}
