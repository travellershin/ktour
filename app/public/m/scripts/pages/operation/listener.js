$(".o").on("click",".omp_list",function(){
    inflate_listTop($(this).attr("pid"));
    generate_filter($(this).attr("pid"));
})
