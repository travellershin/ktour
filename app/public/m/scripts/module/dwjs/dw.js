let dwjs = new DWJS();
$(document).on("click",".dw_dropdown",function(){
    dwjs.dropdown_show();
})


$(document).ready(function(){
    dwjs.dropdown_init();
})

function DWJS(){
    this.dropdown_show = function(result){
        if(result.style.display ==="block"){
            result.style.display = "none"
        }else{
            result.style.display = "block"
        }
    }

    this.dropdown_click = function(){

        for (let i = 0; i < dropdown.length; i++) {
            let cid = dropdown[i].getAttribute("id");

            let originWidth = dropdown[i].clientWidth;
            let originHeight = dropdown[i].clientHeight;


            dropdown[i].innerHTML = "<div id='dwdd_div_"+cid+"'><input id='dwdd_input_"+cid+"'><canvas id='dwdd_cvs_"+cid+"'></canvas></div><div class='dwdd_result' id='dwdd_down_"+cid+"'></div>";

            let div = document.getElementById("dwdd_div_"+cid);
            let input = document.getElementById("dwdd_input_"+cid);
            let cvs = document.getElementById("dwdd_cvs_"+cid);
            let result = document.getElementById("dwdd_down_"+cid);

            if(dropdown[i].hasAttribute("searchable")){
                console.log('예스')
                // TODO: add search eventlistener
                input.style.userSelect = 'text'
            }else{
                input.setAttribute("readonly", "readonly");
            }

            let dropitem = dropdown[i].getAttribute("item").split(",")

            let inTxt = ""
            for (let i = 0; i < dropitem.length; i++) {
                dropitem[i] = dropitem[i].trim();
                inTxt += "<p onclick='dwjs.dropdown_click()' cid='"+cid+"'>"+dropitem[i]+"</p>"
            }

            result.innerHTML = inTxt

            input.value = dropitem[0]
            console.log(originHeight)

            div.height = originHeight
            div.width = originWidth
            cvs.height = originHeight
            cvs.width = originHeight
            input.style.width = originWidth-Math.round(originHeight/3)*2-originHeight+"px";
            input.style.height = originHeight+"px";
            input.style.lineHeight = originHeight+"px";
            input.style.marginLeft = Math.round(originHeight/3)+"px";
            input.style.marginRight = Math.round(originHeight/3)+"px";

            $("#dwdd_down_"+cid+">p")
                .css("line-height", input.style.lineHeight)
                .css("width",originWidth-16)

        }


        let cid = event.target.getAttribute('cid');
        document.getElementById("dwdd_input_"+cid).value = event.target.innerHTML
    }
}
