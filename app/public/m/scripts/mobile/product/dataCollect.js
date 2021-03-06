$(document).ready(function(){

    if(window.localStorage["ktlkey"]){
        let loginKey = window.localStorage["ktlkey"];
        let loginToken = window.localStorage["ktltoken"];
        firebase.database().ref("auth").once("value", snap => {
            adata = snap.val();
            if(adata[loginKey].token === loginToken && adata[loginKey].validdate === datestring.today() && adata[loginKey].grade>0){
                collect_data();
                console.log("login okay");
                if(adata[loginKey].grade === 4){
                    $(".header>ul").append("<li class='header_pageLinks header_singlelink'>MASTERPAGE</li>")
                }
            }else{
                location.href = './index.html'
            }

        });
    }else{
        location.href = './index.html'
    }

});

let product = {} //product 가공 전 data

function collect_data(){
    firebase.database().ref("agency").on("value", snap => {
        agencyArray = []
        let agency = snap.val();
        for (let key in agency) {
            agencyArray.push(agency[key].name)
        }
    });
    firebase.database().ref("place/city").on("value", snap => {
        cityArray = []
        let data = snap.val();
        for (let city in data) {
            cityArray.push(city);
            pickupObj[city] = []
            for (let pickup in data[city]) {
                pickupObj[city].push(pickup)
            }
        }

        $(".pei_area").attr("dropitem",cityArray.toString());
    });
    firebase.database().ref("product").on("value", snap => {
        product = snap.val();

        filtering_data();
    });
}

function filtering_data(){
    inflateArray = []

    let filter_status = new Set();
    let filter_area = new Set();
    let filter_category = new Set();

    for (let key in product) {
        filter_area.add(product[key].info.area);
        filter_status.add(product[key].info.status);
        filter_category.add(product[key].info.category);

        inflateArray.push(key)
    }

    filter = {
        area : Array.from(filter_area),
        status : Array.from(filter_status),
        category : Array.from(filter_category)
    }
    for (let fname in filter) {
        let txt = "";
        for (let i = 0; i < filter[fname].length; i++) {
            txt+='<p class="drop_item">'+filter[fname][i]+'</p>'
        }
        $("#drop_"+fname).html(txt)
    }

    inflate_product(inflateArray);
}
