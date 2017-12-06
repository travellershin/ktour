let orderGuide = new Orderguide;

function Orderguide(){
    this.status_des = function(pid){
        iArray.sort(function(a,b){
            return a.info.status < b.info.status ? 1 : a.info.status > b.info.status ? -1 : 0;
        })
    }
    this.status_asc = function(pid){
        iArray.sort(function(a,b){
            return a.info.status < b.info.status ? -1 : a.info.status > b.info.status ? 1 : 0;
        })
    }
    this.area_des = function(pid){
        iArray.sort(function(a,b){
            return a.area < b.area ? 1 : a.area > b.area ? -1 : 0;
        })
    }
    this.area_asc = function(pid){
        iArray.sort(function(a,b){
            return a.area < b.area ? -1 : a.area > b.area ? 1 : 0;
        })
    }
    this.busDes = function(pid){
        iArray.sort(function(a,b){
            return a.busNumber < b.busNumber ? -1 : a.busNumber > b.busNumber ? 1 : 0;
        })
    }
    this.busAsc = function(pid){
        iArray.sort(function(a,b){
            return a.busNumber < b.busNumber ? 1 : a.busNumber > b.busNumber ? -1 : 0;
        })
    }
    this.pickupAsc = function(pid){
        iArray.sort(function(a,b){
            return placeMatch[a.pickupPlace] < placeMatch[b.pickupPlace] ? 1 : placeMatch[a.pickupPlace] > placeMatch[b.pickupPlace] ? -1 : 0;
        })
    }
    this.pickupDes = function(pid){
        iArray.sort(function(a,b){
            return placeMatch[a.pickupPlace] < placeMatch[b.pickupPlace] ? -1 : placeMatch[a.pickupPlace] > placeMatch[b.pickupPlace] ? 1 : 0;
        })
    }
    this.natAsc = function(pid){
        iArray.sort(function(a,b){
            return a.nationality < b.nationality ? 1 : a.nationality > b.nationality ? -1 : 0;
        })
    }
    this.natDes = function(pid){
        iArray.sort(function(a,b){
            return a.nationality < b.nationality ? -1 : a.nationality > b.nationality ? 1 : 0;
        })
    }
    this.agencyAsc = function(pid){
        iArray.sort(function(a,b){
            return a.agency < b.agency ? 1 : a.agency > b.agency ? -1 : 0;
        })
    }
    this.agencyDes = function(pid){
        iArray.sort(function(a,b){
            return a.agency < b.agency ? -1 : a.agency > b.agency ? 1 : 0;
        })
    }
}
