let orderGuide = new Orderguide;
let rvOrder = [];

$(".r_hbot_product_order").click(function(){
    if(rvOrder[rvOrder.length-1]==="productAsc"){
        rvOrder.push("productDes")
    }else{
        rvOrder.push("productAsc")
    }
    inflate_reservation()
    return false;
})

$(".r_hbot_people").click(function(){
    if(rvOrder[rvOrder.length-1]==="peopleAsc"){
        rvOrder.push("peopleDes")
    }else{
        rvOrder.push("peopleAsc")
    }
    inflate_reservation()
})
$(".r_hbot_name").click(function(){
    if(rvOrder[rvOrder.length-1]==="nameAsc"){
        rvOrder.push("nameDes")
    }else{
        rvOrder.push("nameAsc")
    }
    inflate_reservation()
})
$(".op_hbot_bus").click(function(){
    if(rvOrder[rvOrder.length-1]==="busAsc"){
        rvOrder.push("busDes")
    }else{
        rvOrder.push("busAsc")
    }
    inflate_reservation()
})
$(".r_hbot_pickup_order").click(function(){
    if(rvOrder[rvOrder.length-1]==="pickupAsc"){
        rvOrder.push("pickupDes")
    }else{
        rvOrder.push("pickupAsc")
    }
    inflate_reservation()
    return false;
})
$(".r_hbot_agency_order").click(function(){
    if(rvOrder[rvOrder.length-1]==="agencyAsc"){
        rvOrder.push("agencyDes")
    }else{
        rvOrder.push("agencyAsc")
    }
    inflate_reservation()
    return false;
})
$(".r_hbot_nationality_order").click(function(){
    if(rvOrder[rvOrder.length-1]==="natAsc"){
        rvOrder.push("natDes")
    }else{
        rvOrder.push("natAsc")
    }
    inflate_reservation()
    return false;
})

function Orderguide(){
    let placeMatch = {
        Hongdae:3,
        Myungdong:2,
        Dongdaemoon:1,
        "Busan Station":6,
        Seomyun:5,
        Haeundae:4
    }

    this.peopleDes = function(){
        rData.sort(function(a,b){
            return a.people < b.people ? 1 : a.people > b.people ? -1 : 0;
        })
    }
    this.peopleAsc = function(){
        rData.sort(function(a,b){
            return a.people < b.people ? -1 : a.people > b.people ? 1 : 0;
        })
    }
    this.nameDes = function(){
        rData.sort(function(a,b){
            return a.clientName.trim().toLowerCase() < b.clientName.trim().toLowerCase() ? 1 : a.clientName.trim().toLowerCase() > b.clientName.trim().toLowerCase() ? -1 : 0;
        })
    }
    this.nameAsc = function(){
        rData.sort(function(a,b){
            return a.clientName.trim().toLowerCase() < b.clientName.trim().toLowerCase() ? -1 : a.clientName.trim().toLowerCase() > b.clientName.trim().toLowerCase() ? 1 : 0;
        })
    }
    this.busDes = function(){
        rData.sort(function(a,b){
            return a.busNumber < b.busNumber ? -1 : a.busNumber > b.busNumber ? 1 : 0;
        })
    }
    this.busAsc = function(){
        rData.sort(function(a,b){
            return a.busNumber < b.busNumber ? 1 : a.busNumber > b.busNumber ? -1 : 0;
        })
    }
    this.pickupAsc = function(){
        rData.sort(function(a,b){
            return placeMatch[a.pickupPlace] < placeMatch[b.pickupPlace] ? 1 : placeMatch[a.pickupPlace] > placeMatch[b.pickupPlace] ? -1 : 0;
        })
    }
    this.pickupDes = function(){
        rData.sort(function(a,b){
            return placeMatch[a.pickupPlace] < placeMatch[b.pickupPlace] ? -1 : placeMatch[a.pickupPlace] > placeMatch[b.pickupPlace] ? 1 : 0;
        })
    }
    this.natAsc = function(){
        rData.sort(function(a,b){
            return a.nationality < b.nationality ? 1 : a.nationality > b.nationality ? -1 : 0;
        })
    }
    this.natDes = function(){
        rData.sort(function(a,b){
            return a.nationality < b.nationality ? -1 : a.nationality > b.nationality ? 1 : 0;
        })
    }
    this.productAsc = function(){
        rData.sort(function(a,b){
            return a.product < b.product ? 1 : a.product > b.product ? -1 : 0;
        })
    }
    this.productDes = function(){
        rData.sort(function(a,b){
            return a.product < b.product ? -1 : a.product > b.product ? 1 : 0;
        })
    }
    this.agencyAsc = function(){
        rData.sort(function(a,b){
            return a.agency < b.agency ? 1 : a.agency > b.agency ? -1 : 0;
        })
    }
    this.agencyDes = function(){
        rData.sort(function(a,b){
            return a.agency < b.agency ? -1 : a.agency > b.agency ? 1 : 0;
        })
    }
}
