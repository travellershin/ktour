let orderGuide = new Orderguide;

function Orderguide(){
    let placeMatch = {
        Hongdae:3,
        Myungdong:2,
        Dongdaemoon:1,
        "Busan Station":6,
        Seomyun:5,
        Haeundae:4
    }

    this.peopleDes = function(pid){
        reservation[pid].sort(function(a,b){
            return a.people < b.people ? 1 : a.people > b.people ? -1 : 0;
        })
    }
    this.peopleAsc = function(pid){
        reservation[pid].sort(function(a,b){
            return a.people < b.people ? -1 : a.people > b.people ? 1 : 0;
        })
    }
    this.nameDes = function(pid){
        reservation[pid].sort(function(a,b){
            return a.clientName.trim().toLowerCase() < b.clientName.trim().toLowerCase() ? 1 : a.clientName.trim().toLowerCase() > b.clientName.trim().toLowerCase() ? -1 : 0;
        })
    }
    this.nameAsc = function(pid){
        reservation[pid].sort(function(a,b){
            return a.clientName.trim().toLowerCase() < b.clientName.trim().toLowerCase() ? -1 : a.clientName.trim().toLowerCase() > b.clientName.trim().toLowerCase() ? 1 : 0;
        })
    }
    this.busDes = function(pid){
        reservation[pid].sort(function(a,b){
            return a.busNumber < b.busNumber ? -1 : a.busNumber > b.busNumber ? 1 : 0;
        })
    }
    this.busAsc = function(pid){
        reservation[pid].sort(function(a,b){
            return a.busNumber < b.busNumber ? 1 : a.busNumber > b.busNumber ? -1 : 0;
        })
    }
    this.pickupAsc = function(pid){
        reservation[pid].sort(function(a,b){
            return placeMatch[a.pickupPlace] < placeMatch[b.pickupPlace] ? 1 : placeMatch[a.pickupPlace] > placeMatch[b.pickupPlace] ? -1 : 0;
        })
    }
    this.pickupDes = function(pid){
        reservation[pid].sort(function(a,b){
            return placeMatch[a.pickupPlace] < placeMatch[b.pickupPlace] ? -1 : placeMatch[a.pickupPlace] > placeMatch[b.pickupPlace] ? 1 : 0;
        })
    }
    this.natAsc = function(pid){
        reservation[pid].sort(function(a,b){
            return a.nationality < b.nationality ? 1 : a.nationality > b.nationality ? -1 : 0;
        })
    }
    this.natDes = function(pid){
        reservation[pid].sort(function(a,b){
            return a.nationality < b.nationality ? -1 : a.nationality > b.nationality ? 1 : 0;
        })
    }
}
