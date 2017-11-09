let guide = new Guide();
let guideFaceUrl = "";
let guideFaceCode = "";
let guideSchedule = {}

let isEditing = false;
let uploadedphoto;
let uploadImgFile;
let key = ""
let file = {}
let isPhotoChanged = false;

function uploadGuide(files) {
    isPhotoChanged = true;
    file = files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
            $(".gie_face").attr("src",e.target.result);
        }
    reader.readAsDataURL(file);
}

$(document).ready(function(){
    guide.show();
})
$('.startDatePicker').daterangepicker({
    "autoApply": true,
    singleDatePicker: true,
    locale: { format: 'YYYY-MM-DD'}
},function(start,end,label){
    $('.startDatePicker').val(start.format('YYYY-MM-DD'))
})
$('.endDatePicker').daterangepicker({
    "autoApply": true,
    singleDatePicker: true,
    locale: { format: 'YYYY-MM-DD'}
},function(start,end,label){
    $('.endDatePicker').val(start.format('YYYY-MM-DD'))
})

$(document).on("click", ".g_add", function(){
    //새로운 가이드를 추가한다. guideFace에 대한 정보는 아무것도 없다.
    window.localStorage["guideFaceUrl"] = "";
    window.localStorage["guideFaceCode"] = "";
    $(".pop_blackScreen").removeClass('hidden');
    isEditing = false;
})


$(document).on("click", ".g_pop_delete", function(){
    guide.delete($(this).attr('cid'));
})
$(document).on("click", ".g_pop_edit", function(){
    guideFaceUrl = "";
    guideFaceCode = "";
    guide.edit($(this).attr('cid'));
})



function Guide(){

    this.show = function(){

        window.localStorage["guideFaceUrl"] = "";
        window.localStorage["guideFaceCode"] = "";

        firebase.database().ref("guide").on("value", snap => {
            let gdata = snap.val();
            console.log(gdata)

            //DB key를 가지고 for문을 돌지 않은 이유는 DB는 자동 알파벳순으로 쌓이기 때문!
            let guideInfoArray = ['start','end','email','phone','language','driver','account','address','bonus','preferDay','card','memo']

            let txt = ""
            for (let guides in gdata) {

                let obj = gdata[guides];


                txt+='<div class="g_guide" cid="'+ guides +'"><div class="pop_'+guides+' g_pop hidden"><div cid="'+ guides +'" class="g_pop_edit"><img src="./assets/icon-edit.svg" /><p>EDIT</p></div>'
                txt+='<div cid="'+ guides+'" class="g_pop_delete"><img src="./assets/icon-trash.svg" /><p>DELETE</p></div></div><div class="g_guide_info_div"><img cid="'+ guides +'" class="g_guide_info" src="./assets/icon-more.svg"/></div><div class="g_guide_face_wrapper"><img class="g_guide_face" src="';
                txt+= gdata[guides].imgUrl   + '"/></div><p class="g_guide_name gg_name">'+obj.name+'</p>'

                for (let i = 0; i < guideInfoArray.length; i++) {
                    txt+= '<div class="g_guide_box"><p class="g_guide_title">' + guideInfoArray[i].toUpperCase() + '</p><p class="g_guide_txt gg_'+guideInfoArray[i]+'">'+obj[guideInfoArray[i]]+'</p></div>'
                }
                txt+= '</div>'
            }
            $('.g_guide_div').html(txt)

        });
    }

    this.save = function(sid){
        console.log(sid)
            key = ""
            let guide = {
                name:"",
                start:"",
                end:"",
                card:"",
                email:"",
                phone:"",
                driver:true,
                language:[],
                account:"",
                address:"",
                bonus:"",
                preferDay:[],
                schedule:guideSchedule,
                memo:"",
                imgUrl:""
            }

            for (let data in guide) {
                switch (data) {
                    case "driver":
                        if($(".gge_drive").val()==="X"){
                            guide.driver = false
                        }
                        break;

                    case "language":
                        for (var i = 0; i < $(".gie_languageBox>input:checked").length; i++) {
                            let lang = $(".gie_languageBox>input:checked").eq(i).attr("id").split("_");
                            guide.language.push(lang[1])
                        }
                        if(guide.language.length === 1){
                            guide.language.push("English")
                        }
                        break;

                    case "preferDay":
                        for (var i = 0; i < $(".gie_preferBox>input:checked").length; i++) {
                            let prefer = $(".gie_preferBox>input:checked").eq(i).attr("id").split("_");
                            guide.preferDay.push(prefer[1])
                        }
                        break;

                    case "imgUrl":
                        guide.imgUrl = guideFaceUrl;
                        break;

                    case "schedule":
                        break;

                    default:
                        guide[data] = $(".gge_"+data).val();
                        break;

                }
            }
        if(isEditing){
            key = sid
        }else{
            key =  firebase.database().ref('guide').push().key;
        }


        guideFaceUrl = "";
        guideFaceCode = "";

        if(isPhotoChanged){
            firebase.storage().ref("guides/"+key).put(file).then(function(snapshot) {
                firebase.storage().ref("guides/"+key).getDownloadURL().then(function(url){
                    guide.imgUrl = url
                    $('.pop_blackScreen').addClass('hidden');
                    $('.gie_face').attr('src','')
                }).then(function(){
                    isEditing = false;
                    firebase.database().ref("guide/"+key).set(guide)
                    console.log("사진 변경")
                })
            });
        }else{
            isEditing = false;
            firebase.database().ref("guide/"+key).set(guide)
            console.log("사진 변경하지 않음")
        }



    }


    this.delete = function(guideID){

        //let promptID = prompt('가이드 정보가 영원히 삭제됩니다. 정말 삭제하시려면 가이드 E-mail 주소 @ 앞부분을 정확히 입력하세요');
        //if(guideID === promptID){
            //가이드 사진을 지운다
            firebase.database().ref("guide/"+guideID).once("value", snap => {
                let forUrl = snap.val();
                firebase.storage().ref("guides/"+forUrl.code).delete();
                firebase.database().ref("guide/"+guideID).remove();
                guide.show();
                isEditing = false;
            });
        //    alert('再见')
        //}else{
        //    alert('E-mail 앞부분이 정확히 입력되지 않았습니다.')
    //    }
    }

    this.edit = function(guideID){

        isEditing = true;
        file = {}
        $(".gie_save_div").attr("id",guideID)

        firebase.database().ref("guide/"+guideID).once("value", snap => {
            let data = snap.val();

            guideFaceUrl = data.imgUrl;
            guideFaceCode = data.code

            $('.pop_'+guideID).addClass('hidden')
            let inputArray = ["name","start","end","email","phone","drive","account","address","bonus"];
            for (var i = 0; i < inputArray.length; i++) {
                $('.gge_'+inputArray[i]).val(data[inputArray[i]])
            }
            $('.gge_memo').html(data.memo)

            let lang = data.language;
            let day = data.preferDay;
            if(lang){
                for (let i = 0; i < lang.length; i++) {
                    let language = lang[i].trim();
                    $("#gie_"+language).prop('checked', true) ;
                }
            }
            if(day){
                for (let i = 0; i < day.length; i++) {
                    let dayin = day[i].trim()
                    $("#gie_"+dayin).prop('checked', true) ;
                }
            }


            $('.gie_face').attr('src',data.imgUrl )
            $(".pop_blackScreen").removeClass('hidden')

        });
    }
}




$(document).on("click", ".g_guide_info", function(){
    let cid = $(this).attr('cid')
    if($('.pop_'+cid).hasClass('hidden')){
        $('.pop_'+cid).removeClass('hidden')
    }else{
        $('.pop_'+cid).addClass('hidden')
    }
})


$(document).on("click", ".gie_header>button[type='reset']", function(){
    $(".pop_blackScreen").addClass('hidden')
    $('.gie_face').attr('src','')
    window.localStorage["guideFaceUrl"] = "";
    window.localStorage["guideFaceCode"] = "";
})

$(document).on("click", ".gie_save_div", function(){

    guide.save($(this).attr("id"));

})
