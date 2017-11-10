$(".r_set_chartToggle").click(function(){
    if($(this).html()==="표로 보기"){
        $(".r_stat_pie").addClass("hidden");
        $(".r_stat_second").removeClass("hidden");
        $(this).html("차트로 보기")
    }else{
        $(".r_stat_pie").removeClass("hidden");
        $(".r_stat_second").addClass("hidden");
        $(this).html("표로 보기")
    }
})

function draw_chart(){
    console.log(r_chart)

    let sort = {agency:[],product:[],nationality:[]};
    let sort_etc = {agency:[],product:[],nationality:[]};

    let sumrev = 0
    let sum = {
        agency:0,
        product:0,
        nationality:0
    }

    for (let key in sort) {
        sumrev = 0
        for (let item in r_chart[key]) {
            sort[key].push([item,r_chart[key][item][0],r_chart[key][item][1]]);
            sum[key]+=r_chart[key][item][1];
            sumrev+=r_chart[key][item][0];
        }
        sort[key].sort(function(a, b) {
            return b[2] - a[2];
        });

        let etc = ["etc",0,0]

        for (let i = 0; i < sort[key].length; i++) {
            if(sort[key][i][2]<sum[key]*0.03){
                etc[1]+=sort[key][i][1];
                etc[2]+=sort[key][i][2];
            }else{
                sort_etc[key].push(sort[key][i])
            }
        }
        sort_etc[key].push(etc)

    }

    let chartist = { //자료구조 명시를 위해 열어놓음
        agency:{
            labels:[],
            series:[]
        },
        product:{
            labels:[],
            series:[]
        },
        nationality:{
            labels:[],
            series:[]
        }
    };

    for (let i = 0; i < sort_etc.agency.length; i++) {
        chartist.agency.labels.push(sort_etc.agency[i][0]+"("+Math.round(sort_etc.agency[i][2]*100/sum.agency)+"%)");
        chartist.agency.series.push(sort_etc.agency[i][2])
    }
    for (let i = 0; i < sort_etc.nationality.length; i++) {
        chartist.nationality.labels.push(sort_etc.nationality[i][0]+"("+Math.round(sort_etc.nationality[i][2]*100/sum.nationality)+"%)");
        chartist.nationality.series.push(sort_etc.nationality[i][2])
    }
    for (let i = 0; i < sort_etc.product.length; i++) {
        if(sort_etc.product[i][0]==="etc"){
            chartist.product.labels.push("etc"+"("+Math.round(sort_etc.product[i][2]*100/sum.product)+"%)");
        }else{
            chartist.product.labels.push(sort_etc.product[i][0].split("_")[2]+"("+Math.round(sort_etc.product[i][2]*100/sum.product)+"%)");
        }

        chartist.product.series.push(sort_etc.product[i][2])
    }

    new Chartist.Pie('#chart_product', chartist.product);
    new Chartist.Pie('#chart_agency', chartist.agency);
    new Chartist.Pie('#chart_nationality', chartist.nationality);

    $(".r_stat_total").html("TOTAL "+sumrev+"건 "+sum.product+"명")

    console.log(sort)
    for (let key in sort) {
        let txt=""
        for (let i = 0; i < sort[key].length; i++) {
            if(key==="product"){
                txt+='<div class="r_stat_pyo_line"><p class="r_stat_pyo_name">'+sort[key][i][0].split("_")[2]+'</p>';
            }else{
                txt+='<div class="r_stat_pyo_line"><p class="r_stat_pyo_name">'+sort[key][i][0]+'</p>';
            }

            txt+='<p class="r_stat_pyo_r">'+sort[key][i][1]+'</p><p class="r_stat_pyo_p">'+sort[key][i][2]+'</p></div>'
        }
        $(".r_stat_pyo_"+key).html(txt)
    }
}
