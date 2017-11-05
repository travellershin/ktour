function toast(txt){
    if($(".snackbar").length>0){
        $(".snackbar").remove();
    }
    $("body").append('<div class="snackbar">'+txt+'</div>');
    $(".snackbar").addClass("show");
    setTimeout(function () {
        $(".snackbar").removeClass("show")
    }, 3000);
}
