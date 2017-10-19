let show = new Show();
let statusColor = new StatusColor();

function Show(){
    this.info = function(){
        /* 본래 코드
        $('.lightBox_shadow').removeClass('hidden');
        $('.pi').removeClass('hidden');
        $('.pe').addClass('hidden');
        $('.pi_tab').addClass('hidden');
        $('.pi_tab_info').removeClass('hidden');

        $('.pii_itinerary').height(1).height($('.pii_itinerary').prop('scrollHeight'));
        $('.pii_cancellation').height(1).height($('.pii_cancellation').prop('scrollHeight'));
        $('.pii_description').height(1).height($('.pii_description').prop('scrollHeight'));
        $('.pii_inclusive').height(1).height($('.pii_inclusive').prop('scrollHeight'));
        $('.pii_exclusive').height(1).height($('.pii_exclusive').prop('scrollHeight'));
        $('.pii_others').height(1).height($('.pii_others').prop('scrollHeight'));
        */
        $('.lightBox_shadow').removeClass('hidden');
        $('.pi').addClass('hidden');
        $('.pe').removeClass('hidden');
        $('.pi_tab').addClass('hidden');
        $('.pi_tab_info').addClass('hidden');
        $('.pe_tab').addClass('hidden');
        $('.pe_tab_info').removeClass('hidden');

        $('.pii_itinerary').height(1).height($('.pii_itinerary').prop('scrollHeight'));
        $('.pii_cancellation').height(1).height($('.pii_cancellation').prop('scrollHeight'));
        $('.pii_description').height(1).height($('.pii_description').prop('scrollHeight'));
        $('.pii_inclusive').height(1).height($('.pii_inclusive').prop('scrollHeight'));
        $('.pii_exclusive').height(1).height($('.pii_exclusive').prop('scrollHeight'));
        $('.pii_others').height(1).height($('.pii_others').prop('scrollHeight'));
    }

    this.info_edit = function(){
        $('.lightBox_shadow').removeClass('hidden');
        $('.pe').removeClass('hidden');
        $('.pe_tab').addClass('hidden');
        $('.pe_tab_info').removeClass('hidden');
    }

    this.tab_info = function(div){
        let tabName = $(div).html().toLowerCase();
        $(".pi_tab").addClass("hidden");
        $(".pi_tab_"+tabName).removeClass("hidden");
        $(".pi_nav").children().removeClass("pi_nav--selected");
        $(div).addClass("pi_nav--selected")
    }

    this.tab_edit = function(div){
        let tabName = $(div).html().toLowerCase();
        $(".pe_tab").addClass("hidden");
        $(".pe_tab_"+tabName).removeClass("hidden");
        $(".pe_nav").children().removeClass("pe_nav--selected");
        $(div).addClass("pe_nav--selected")
    }
}

function StatusColor(){
    this.green = function(){
        $('.pii_status').addClass('bgco_green');
        $('.pii_status').removeClass('bgco_orange');
        $('.pii_status').removeClass('bgco_red');
    }

    this.red = function(){
        $('.pii_status').removeClass('bgco_green');
        $('.pii_status').removeClass('bgco_orange');
        $('.pii_status').addClass('bgco_red');
    }

    this.orange = function(){
        $('.pii_status').removeClass('bgco_green');
        $('.pii_status').addClass('bgco_orange');
        $('.pii_status').removeClass('bgco_red');
    }
}
