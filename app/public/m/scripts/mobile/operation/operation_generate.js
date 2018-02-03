let countO = {
    Seoul:{
        Myungdong:0,
        Dongdaemoon:0,
        Hongdae:0
    },
    Busan:{
        "Busan Station":0,
        Haeundae:0,
        Seomyun:0
    }
}
// TODO: 이 기능은 Reservation에서 먼저 완성되었고, Operation에 아직 제대로 도입되지 않은 기능이다.


function operation_generate(date){
    reservation = {}
    r_obj = {}

    for (let product in operation) {
        reservation[product] = [];  //reservation탭에서와 달리 reservation과 r_obj는 product별로 담겨야 한다.
        r_obj[product] = {};

        let productPeople = 0 //상품의 총 인원수를 표기하기 위한 변수
        operation[product].teamArgArray = []
        // Operation에서 team(BUS)는 랜덤 키로 저장되기 때문에 생성된 순서대로 표시된다고 보장할 수 없다. 따라서 배열에 키와 생성시간을 담고,
        //생성시간 순으로 키를 정렬하는 과정이 필요하다. (아래 for문 끝난 직후 sort 개시)
        for (let team in operation[product].teams) {

            for (let id in operation[product].teams[team].reservations) { //각 reservation들을 product별로 구분해 담는다.
                reservation[product].push(operation[product].teams[team].reservations[id])
                r_obj[product][id] = operation[product].teams[team].reservations[id]
            }

            operation[product].teamArgArray.push({name:team,time:operation[product].teams[team].time})
            //전체 상품, 팀의 인원을 합산한다.
            let teamPeople = 0
            for (let reservation in operation[product].teams[team].reservations) {
                let rrv = operation[product].teams[team].reservations[reservation];
                if(countO[rrv.area]){ //인원수를 파악하기 위함
                    if(countO[rrv.area][rrv.pickupPlace]){
                        countO[rrv.area][rrv.pickupPlace]+=rrv.people
                    }else{
                        countO[rrv.area][rrv.pickupPlace]=rrv.people
                    }
                }else{
                    countO[rrv.area] = {};
                    countO[rrv.area][rrv.pickupPlace]=rrv.people
                }
                teamPeople+=rrv.people
                productPeople+=rrv.people
            }
            operation[product].teams[team].people = teamPeople
        }
        operation[product].teamArgArray.sort(function(a, b) {
            return a.time - b.time;
        });

        for (let i = 0; i < operation[product].teamArgArray.length; i++) {
            operation[product].teamArgArray[i] = operation[product].teamArgArray[i].name //teamArgArray에서 생성시간의 역할은 이제 끝났다. 이름만 남기기
        }
        operation[product].people = productPeople

        reservation[product].sort(function(a,b){ //추후 각 필터별로 정렬할 때 정렬 순서를 보장할 수 있도록 id순으로 한 번 정렬해준다.
            return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        })
    }

    guideTotal = [];
    guideTeam = {};

    let cityTxt = {} //이하에서 operation 메인화면을 inflate한다

    for (let product in operation) {
        let domdata = operation[product]

        if(!cityTxt[domdata.area]){
            cityTxt[domdata.area] = " "
        }

        cityTxt[domdata.area]+='<div class="om_box_pd" pid="'+product+'"><p class="omp_name">'+product.split("_")[2]+'</p>'
        cityTxt[domdata.area]+='<div class="omp_people"><p class="omp_people_txt">PEOPLE</p><p class="omp_people_number">'+domdata.people+'</p></div>'
        if(operation[product].teams){
            cityTxt[domdata.area]+='<div class="omp_bus"><p class="omp_bus_txt">BUS</p><p class="omp_bus_number">'+Object.keys(domdata.teams).length+'</p></div><div class="omp_box">'
        }else{
            cityTxt[domdata.area]+='<div class="omp_bus"><p class="omp_bus_txt">BUS</p><p class="omp_bus_number">0</p></div><div class="omp_box">'
        }


        if(operation[product].teams){
            for (let i = 0; i < operation[product].teamArgArray.length; i++) {
                let tid = operation[product].teamArgArray[i]

                cityTxt[domdata.area]+='<div class="omp_team" pid="'+product+'" tid="'+tid+'"><div class="omp_team_liner"><p class="omp_team_names_bus">BUS '+(i+1)+'</p>'
                cityTxt[domdata.area]+='<p class="omp_team_people">'+domdata.teams[tid].people+'</p></div>'

                if(domdata.teams[tid].guide){
                    cityTxt[domdata.area]+='<p class="omp_team_names_guide">'
                    let guideDeleted = true;
                    for (let j = 0; j < domdata.teams[tid].guide.length; j++) {
                        if(domdata.teams[tid].guide[j] in guideData){
                            guideDeleted = false;
                            cityTxt[domdata.area] += guideData[domdata.teams[tid].guide[j]].name +", ";
                            guideTotal.push(domdata.teams[tid].guide[j]);
                            guideTeam[domdata.teams[tid].guide[j]] = [product,tid,i+1,j]
                        }
                    }
                    if(!guideDeleted){ //가이드가 딜리트되었다면 위에서 ", " 부분이 입력되지 않을 것이고, 따라서 아무것도 잘라내어서는 안 된다.
                        cityTxt[domdata.area] = cityTxt[domdata.area].slice(0, -2)
                    }
                    cityTxt[domdata.area]+='</p></div>'

                }else{
                    cityTxt[domdata.area]+='<p class="omp_team_names_guide">Unassigned</p></div>'
                }



            }
        }



        cityTxt[domdata.area]+='</div><div class="omp_list" pid="'+product+'"><div class="omp_list_inner">VIEW LIST</div></div></div>'

    }

    let countT = {
        Seoul:0,
        Busan:0
    }

    let txt = ""

    if(cityTxt.Seoul){
        txt+='<div class="o_cityBox"><div class="ov_hidden"><p class="o_cityBox_cityName fl_left">Seoul</p></div>';
        txt+=cityTxt.Seoul;
        txt+='</div>'
    }
    if(cityTxt.Busan){
        txt+='<div class="o_cityBox"><p class="o_cityBox_cityName">Busan</p>';
        txt+=cityTxt.Busan;
        txt+='</div>'
    }
    for (let city in cityTxt) {
        if(city !== "Busan" && city !== "Seoul"){
            txt+='<div class="o_cityBox"><p class="o_cityBox_cityName">'+city+'</p>';
            txt+=cityTxt[city];
            txt+='</div>'
        }
    }
    $(".om").html(txt)

    cash_guide = [];
    asset_guide = []

    for (let product in operation) {
        if(operation[product].people>0){
            firebase.database().ref("operation/"+date+"/"+product+"/people").set(operation[product].people);
        }

        for (let team in operation[product].teams) {
            let data = operation[product].teams[team];

            if(data.people>0){
                firebase.database().ref("operation/"+date+"/"+product+"/teams/"+team+"/people").set(operation[product].teams[team].people);
            }

            if(data.cash){
                for (let guide in data.cash) {
                    if(data.cash[guide]>0){
                        cash_guide.push(guide)
                    }
                }
            }

            if(data.asset){
                asset_guide.push(data.guide[0])
            }

            // TODO: asset_guide도 이런 식으로 초기화
        }
    }
    console.log(asset_guide)
    if(lastRendering.product.length>0){
        inflate_listTop() //보고 있던 product가 있는 경우 해당 화면을 갱신한다.
        inflate_reservation()
    }

}
