
function operation_generate(date){
    for (let product in operation) {

        let productPeople = 0
        operation[product].teamArgArray = []
        for (let team in operation[product].teams) {

            operation[product].teamArgArray.push({name:team,time:operation[product].teams[team].time})
            //전체 상품, 팀의 인원을 합산한다.
            let teamPeople = 0
            for (let reservation in operation[product].teams[team].reservations) {
                teamPeople+=operation[product].teams[team].reservations[reservation].people
                productPeople+=operation[product].teams[team].reservations[reservation].people
            }
            operation[product].teams[team].people = teamPeople
        }

        operation[product].teamArgArray.sort(function(a, b) {
            return a.time - b.time;
        });
        for (let i = 0; i < operation[product].teamArgArray.length; i++) {
            operation[product].teamArgArray[i] = operation[product].teamArgArray[i].name
        }
        operation[product].people = productPeople

    }

    let txt = ""

    guideTotal = [];
    guideTeam = {};

    let cityTxt = {}

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

                cityTxt[domdata.area]+='<div class="omp_team" pid="'+product+'" tid="'+tid+'"><div class="omp_team_names"><p class="omp_team_names_bus">BUS '+(i+1)+'</p>'
                if(domdata.teams[tid].guide){
                    cityTxt[domdata.area]+='<p class="omp_team_names_guide">'
                    for (let j = 0; j < domdata.teams[tid].guide.length; j++) {
                        if(guideData[domdata.teams[tid].guide[j]]){
                            cityTxt[domdata.area] += guideData[domdata.teams[tid].guide[j]].name +", ";
                            guideTotal.push(domdata.teams[tid].guide[j]);
                            guideTeam[domdata.teams[tid].guide[j]] = [product,tid,i+1,j]
                        }
                    }
                    cityTxt[domdata.area] = cityTxt[domdata.area].slice(0, -2)
                    cityTxt[domdata.area]+='</p></div>'

                }else{
                    cityTxt[domdata.area]+='<p class="omp_team_names_guide">Unassigned</p></div>'
                }

                cityTxt[domdata.area]+='<p class="omp_team_people">'+domdata.teams[tid].people+'</p></div>'

            }
        }



        cityTxt[domdata.area]+='</div><div class="omp_list" pid="'+product+'"><img src="./assets/icon-list.svg"/><p>VIEW LIST</p></div></div>'

    }


    if(cityTxt.Seoul){
        txt+='<div class="o_cityBox"><p class="o_cityBox_cityName">Seoul</p>';
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

    for (let product in operation) {
        if(operation[product].people>0){
            firebase.database().ref("operation/"+date+"/"+product+"/people").set(operation[product].people);

        }

        for (let team in operation[product].teams) {
            if(operation[product].teams[team].people>0){
                firebase.database().ref("operation/"+date+"/"+product+"/teams/"+team+"/people").set(operation[product].teams[team].people);
            }
        }
    }
}
