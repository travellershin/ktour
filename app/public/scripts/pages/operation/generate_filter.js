let rData = []; //product별 reservation data
let r_obj = {}; //
let team_rData = [] //team별로 구분된 rData

let showData = []; //보여주는 reservation data -> 별처리 등을 한 뒤에도 요걸로 보여야 함.

function generate_filter(){
    console.log(team_rData)
    console.log(rData)
    console.log(r_obj)

    let filter_pickupPlace = new Set(); //필터 이름
    let filter_nationality = new Set(); //필터 이름
    let filter_agency = new Set(); //필터 이름

    for (let i = 0; i < rData.length; i++) {
        filter_pickupPlace.add(rData[i].pickupPlace)
        filter_nationality.add(rData[i].nationality)
        filter_agency.add(rData[i].agency)
    }

    filter = {
        agency:Array.from(filterMap.agency.keys()),
        pickupPlace:Array.from(filterMap.pickupPlace.keys()),
        nationality:Array.from(filterMap.nationality.keys())
    }
}
