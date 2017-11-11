
function inflate_data(){
    for (let product in operationData[date]) {

        let productPeople = 0
        operationData[date][product].teamArgArray = []
        for (let team in operationData[date][product].teams) {

            operationData[date][product].teamArgArray.push({name:team,time:operationData[date][product].teams[team].time})
            //전체 상품, 팀의 인원을 합산한다.
            let teamPeople = 0
            for (let reservation in operationData[date][product].teams[team].reservations) {
                teamPeople+=operationData[date][product].teams[team].reservations[reservation].people
                productPeople+=operationData[date][product].teams[team].reservations[reservation].people
            }
            operationData[date][product].teams[team].people = teamPeople
        }

        operationData[date][product].teamArgArray.sort(function(a, b) {
            return a.time - b.time;
        });
        for (let i = 0; i < operationData[date][product].teamArgArray.length; i++) {
            operationData[date][product].teamArgArray[i] = operationData[date][product].teamArgArray[i].name
        }
        operationData[date][product].people = productPeople

    }

    let txt = ""


    for (let product in operationData[date]) {
        let domdata = operationData[date][product]
        if(domdata.teams){//터짐방지를 위한 임시 null처리
            txt+='<div class="om_box_pd" pid="'+product+'"><p class="omp_name">'+product.split("_")[2]+'</p>'
            txt+='<div class="omp_people"><p class="omp_people_txt">PEOPLE</p><p class="omp_people_number">'+domdata.people+'</p></div>'
            txt+='<div class="omp_bus"><p class="omp_bus_txt">BUS</p><p class="omp_bus_number">'+Object.keys(domdata.teams).length+'</p></div><div class="omp_box">'

                for (let i = 0; i < operationData[date][product].teamArgArray.length; i++) {
                    let tid = operationData[date][product].teamArgArray[i]

                    txt+='<div class="omp_team" pid="'+product+'" tid="'+tid+'"><div class="omp_team_names"><p class="omp_team_names_bus">BUS '+(i+1)+'</p>'
                    if(domdata.teams[tid].guide){
                        txt+='<p class="omp_team_names_guide">'
                        for (let i = 0; i < domdata.teams[tid].guide.length; i++) {
                            console.log(guidedata)
                            console.log(domdata.teams[tid].guide[i])
                            txt += guidedata[domdata.teams[tid].guide[i]].name +", "
                        }
                        txt = txt.slice(0, -2)
                        txt+='</p></div>'

                    }else{
                        txt+='<p class="omp_team_names_guide">Unassigned</p></div>'
                    }

                    txt+='<p class="omp_team_people">'+domdata.teams[tid].people+'</p></div>'

                }

            txt+='</div><div class="omp_list" pid="'+product+'"><img src="./assets/icon-list.svg"/><p>VIEW LIST</p></div></div>'
        }
    }

    $(".om").html(txt)
    for (let product in operationData[date]) {
        firebase.database().ref("operation/"+date+"/"+product+"/people").set(operationData[date][product].people);
        for (let team in operationData[date][product].teams) {
            firebase.database().ref("operation/"+date+"/"+product+"/teams/"+team+"/people").set(operationData[date][product].teams[team].people);
        }
    }

    if(viewing.length>0){
        showList(viewing)
    }
}
