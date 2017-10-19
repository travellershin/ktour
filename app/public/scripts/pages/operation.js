$('.o_header_date_txt').daterangepicker({
    "autoApply": true,
    singleDatePicker: true,
    locale: { format: 'YYYY-MM-DD'}
},function(start,end,label){
    getOpData(start.format('YYYY-MM-DD'))
})

let operation = {}
let teamObj = {}

$(document).ready(function(){
    $(".r_set_date_txt").html(datestring.today());
    getOpData(datestring.today())
})

$(document).on("click",".omp_team",function(){
    let tid = $(this).attr("tid")
    $(".om_pop").css("left",event.pageX + "px")
                .css("top",event.pageY  + "px")
    $(".om_pop").toggleClass("hidden")
    console.log(teamObj[tid])
    $(".om_pop_company").html(teamObj[tid].bus_name);
    $(".om_pop_people").html(teamObj[tid].people);
    $(".om_pop_cost").html(teamObj[tid].bus_cost);
    $(".om_pop_message").html(teamObj[tid].message);
    if(teamObj[tid].guide){
        $(".om_pop_guide").html(teamObj[tid].guide);
    }else{
        $(".om_pop_guide").html("Unassigned");
    }

})

$(document).click(function(e){ //문서 body를 클릭했을때
    if(!e.target.className =="omp_team"){
        if(e.target.className =="om_pop"){return false} //내가 클릭한 요소(target)를 기준으로 상위요소에 .share-pop이 없으면 (갯수가 0이라면)
     	$(".om_pop").addClass("hidden")
        console.log('close')
    }
 });


function getOpData(date){
    firebase.database().ref("operation/"+date).on("value",snap => {
        let data = snap.val();
        if(!operation[date]){
            operation[date] = {}
        }
        if(data){
            for (let productName in data) {
                // TODO: PRIVATE 걸러내기
                let pname = productName.split("_");
                let num_people = 0;
                let num_bus = 0;
                if(!operation[date][pname[0]]){ //operation.seoul이 없으면
                    operation[date][pname[0]] = {}; //만들어
                }
                for (let i = 0; i < data[productName].teams.length; i++) {

                    for (let rev in data[productName].teams[i].reservations) {
                        num_people += data[productName].teams[i].reservations[rev].people;
                    }
                    num_bus++
                }
                operation[date][pname[0]][pname[2]] = {
                    teams:data[productName].teams,
                    people:num_people,
                    bus:num_bus
                }
            }
        }else{
            alert('해당일 예약은 아직 잡히지 않았습니다')
        }
        inflate_op(operation[date])
    })
}

function inflate_op(data){

    let txt = "";
    for (let place in data) {
        for (let productName in data[place]) {
            let people_total = 0
            let teams_no = 0
            let product = data[place][productName];
            for (let team in product.teams) {
                teamObj[team] = product.teams[team]
                let people_team = 0
                for (let reservation in product.teams[team].reservations) {
                    people_total+=product.teams[team].reservations[reservation].people
                    people_team += product.teams[team].reservations[reservation].people
                }
                teams_no++
                product.teams[team].people = people_team
            }
            product.bus = teams_no
            product.people = people_total
        }
    }

    console.log(data)
    console.log(teamObj)

    for (let place in data){
        txt+='<div class="om_city om_city_'+place+'"><p class="om_city_name">'+place.toUpperCase()+'</p>'
        txt+='<div class="om_box">'

        for (let product in data[place]) {
            txt+='<div class="om_box_pd"><p class="omp_name">'+product+'</p>'
            txt+='<div class="omp_people"><p class="omp_people_txt">PEOPLE</p><p class="omp_people_number">'+data[place][product].people+'</p></div>'
            txt+='<div class="omp_bus"><p class="omp_bus_txt">BUS</p><p class="omp_bus_number">'+data[place][product].bus+'</p></div>';

            let i = 1;
            for (let team in data[place][product].teams) {
                txt+='<div class="omp_team" tid="'+team+'"><div class="omp_team_names"><p class="omp_team_names_bus">BUS '+i+'</p>'
                if(data[place][product].teams[team].guide){
                    txt+='<p class="omp_team_names_guide">'+data[place][product].teams[team].guide+'</p>'
                }else{
                    txt+='<p class="omp_team_names_guide">Unassigned</p>'
                }
                txt+='</div><p class="omp_team_people">'+data[place][product].teams[team].people+'</p></div>'
                // TODO: ㅁㅈㄷㅊㄱㅈㄷ
            }


            txt+='</div>'
        }


        txt+='</div></div>'
    }

    $(".om").html(txt);
}
