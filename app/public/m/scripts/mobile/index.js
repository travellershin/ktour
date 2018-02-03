let adata = {};
let idArray = [];

$(document).ready(function(){
    firebase.database().ref("auth").once("value", snap => {
        adata = snap.val();
        for (let key in adata) {
            idArray.push(adata[key].mail)
        }

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
    });
})
$(".input").focus(function(){
    $(".login_logo").addClass("hidden")
})
$(".input").blur(function(){
    $(".login_logo").removeClass("hidden")
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
    let validPass = ""
    let success = false;
    let loginkey = "";
    let grade = 0;
    for (let key in adata) {
        if(adata[key].mail === mail){
            validPass = adata[key].password
            success = true;
            loginkey = key;
        }
    }


    if(success){
        //ID는 일치함
        if(validPass === pass){
            //로그인 성공
            $('.login_wrong').addClass('hidden');
            $('.login_email').removeClass('input_wrong');
            $('.login_password').removeClass('input_wrong');
            let helloCheck = 0
            let token = firebase.database().ref().push().key
            firebase.database().ref("auth/"+loginkey+"/token").set(token)
            firebase.database().ref("auth/"+loginkey+"/validdate").set(datestring.today())
            window.localStorage['ktltoken'] = token;
            window.localStorage['ktlkey'] = loginkey

            location.href = './reservation.html'

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
