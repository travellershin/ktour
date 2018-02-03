
$(".m_header").on("click",".m_header_li",function(){
    $('.m_header_li').removeClass('m_header_li--checked');
    $(this).addClass('m_header_li--checked');
	window.localStorage['lastPage'] = $(this).html();
})


$(".m_header").on("click",".m_header_logOut",function(){
    alert('로그아웃')
})
