let orderGuide = new Orderguide;

function Orderguide(){
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
}
