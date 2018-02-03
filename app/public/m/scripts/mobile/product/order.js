let orderGuide = new Orderguide;

function Orderguide(){
    this.status_des = function(){
        iArray.sort(function(a,b){
            return a.info.status < b.info.status ? 1 : a.info.status > b.info.status ? -1 : 0;
        })
    }
    this.status_asc = function(){
        iArray.sort(function(a,b){
            return a.info.status < b.info.status ? -1 : a.info.status > b.info.status ? 1 : 0;
        })
    }
    this.area_des = function(){
        iArray.sort(function(a,b){
            return a.info.area < b.info.area ? 1 : a.info.area > b.info.area ? -1 : 0;
        })
    }
    this.area_asc = function(){
        iArray.sort(function(a,b){
            return a.info.area < b.info.area ? -1 : a.info.area > b.info.area ? 1 : 0;
        })
    }
    this.category_des = function(){
        iArray.sort(function(a,b){
            return a.info.category < b.info.category ? -1 : a.info.category > b.info.category ? 1 : 0;
        })
    }
    this.category_asc = function(){
        iArray.sort(function(a,b){
            return a.info.category < b.info.category ? 1 : a.info.category > b.info.category ? -1 : 0;
        })
    }
    this.product_des = function(){
        iArray.sort(function(a,b){
            return a.info.name < b.info.name ? 1 : a.info.name > b.info.name ? -1 : 0;
        })
    }
    this.product_asc = function(){
        iArray.sort(function(a,b){
            return a.info.name < b.info.name ? -1 : a.info.name > b.info.name ? 1 : 0;
        })
    }
}
