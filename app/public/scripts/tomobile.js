let durl = window.location.href;
durl = durl.split("//");
let after = durl[1].split("/");
let mPage = ["reservation.html", "operation.html","guide.html", "account.html"];
let final = ""

if(mPage.includes(after[1])){
    final = durl[0]+"//"+after[0]+"/m/"+after[1];
}else{
    final = "reservation.html";
}

if(screen.width<640){
    console.log("640아래야")
    if(window.localStorage["isMobile"]){
        console.log(window.localStorage["isMobile"])
        if (window.localStorage["isMobile"] === "yes") {
            location.href = final;
        }else{
            $(".header").width(1300)
            console.log("데스크톱이야")
            $(".header>ul").append("<li class='header_pageLinks header_toMobile'>MOBLIE</li>");
            console.log($(".header>ul"))
        }
    }else{
        window.localStorage["isMobile"] = "yes";
        location.href = final;
    }
}
