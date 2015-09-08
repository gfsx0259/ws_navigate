core.apps.room_availability = function(args) {

    this.defaultProfile = {
        title: "",
        motel_id: ""
    }

}


core.apps.room_availability.prototype = {


    // sys

    buildContent: function(el) {
        this.displayTpl(this.$["content"], "room_availability");
        if(!document.getElementById("app_ra_booking_info")) {
            var el = document.createElement("div");
            el.className = "ra_booking_info";
            el.id = "app_ra_booking_info";
            el.innerHTML = 
                "<div>Date arrive: <span id='app_ra_bi_date_arrive'></span></div>" +
                "<div>Duration: <span id='app_ra_bi_duration'></span></div>" +
                "<div>Total: $<span id='app_ra_bi_total'></span></div>";
            document.body.appendChild(el);
        }
    },


    onOpen: function() {
        core.externals.datepicker({
            button: this.$["btn_calendar"],
            showsTime: false,
            singleClick: true,
            onUpdate: this.onCalSelected.bind(this)
        });

        this.setTitle(this.profile["title"]);

        this.day_ofs = 0;
        this.days_loaded = 14;
        this.getTodayFromServer();
    },
    

    onClose: function() {
        this.booking = false;
    },



    // rooms code
    refresh: function() {
        if(!this.date_arrive) {
            return;
        }
        this.initCalendar();
        this.renderRooms();
    },




    // load data

    loadData: function(d) {
        var sendDate = d.getFullYear() + "-" + (d.getMonth()*1+1)+"-" + (d.getDate() >= 10 ? d.getDate() : '0'+d.getDate());
        this.sendToServer({ date: sendDate });
    },


    getTodayFromServer: function(){
        this.sendToServer({ act: 'get_server_time' });
    },
    

    updateDatesFromServer: function(date_y,date_m,date_d){
        this.date_arrive = new Date(Date.UTC(date_y,date_m-1,date_d,0,0,0));
        //changeing only by calendar
        this.EXTRADATE = new Date(Date.UTC(date_y,date_m-1,date_d,0,0,0));
        this.loadData(this.date_arrive);
    },
    
    



    // navigation

    initNav: function() {
        this.$["date"].innerHTML = this.date_arrive.format("d M Y");
    },


    onCalSelected: function(cal) {
        this.booking = false;

        var d = cal.date;

        this.day_ofs = 0;
        this.days_loaded = 14;

        var now = new Date();
        now.setHours(0, 0, 0, 0);
        if(d.getTime() < now.getTime()){
            d = now;
        }
        this.date_arrive.setTime(d.getTime());
        if(!this.EXTRADATE) this.EXTRADATE = new Date();
        this.EXTRADATE.setTime(d.getTime());
        this.loadData(this.date_arrive);
    },


    navigate: function(e) {
        e = core.browser.event.fix(e);
        e.target.blur();
        var ofs = parseInt(e.target.ofs, 10);
        if(ofs == 0) return;
        this.day_ofs += ofs;
        if(this.day_ofs < 0) {
            var prev = new Date(this.date_arrive.getTime() - 7 * 86400000);
            var now = new Date();
            now.setHours(0, 0, 0, 0);
            if (prev.getTime() < now.getTime()){
                this.day_ofs -= ofs;
                return false;
            }
            var d = new Date(this.date_arrive.getTime() - 14 * 86400000);
            this.day_ofs = 7;
            this.append_data_dir = "l";
        } else if(this.day_ofs > this.days_loaded - 14) {
            var d = new Date(this.date_arrive.getTime() + 14 * 86400000);
            this.append_data_dir = "r";
        }
        this.date_arrive.setDate(this.date_arrive.getDate() + ofs);
        if(d) {
            this.loadData(d);
        } else {
            this.refresh();
        }
    },



    // show content

    initCalendar: function() {
        this.dates = [];

        var html = "";
        for(var i=0; i<14; i++) {
            var d = new Date(this.date_arrive.getTime());
            d.setDate(this.date_arrive.getDate() + i);
            this.dates[i] = d;
        
            html += 
                "<div class='cell'>" +
                core.common.weekdays_short[d.getDay()] + 
                "<br/>" + 
                d.getDate() + 
                " " + 
                core.common.monthes_short[d.getMonth()] +
                "</div>";
        }
        this.$["rooms_dates"].innerHTML = html;
    },




    renderRooms: function() {
        this.showElement("rooms");
        this.initNav();
        this.initCalendar();

        var fire_rate = this.rooms_data.fire_rate / 100;

/*
        var ext_systems_list_html = "";
        var ext_systems = [];
        for(var i=0; i<this.ext_systems.length; i++) {
            var sys = this.ext_systems[i];
            if(!sys.allowed || sys.id == 12) continue;
            var url = sys.url;
            url = url.replace("https://", "").replace("http://", "").replace("www.", "");
            ext_systems_list_html += "<span>" + url + "</span>";
            ext_systems.push(sys.id);
        }
*/

        var html = "";

        for(var i=0; i<this.rooms_data.list.length; i++) {
            var room = this.rooms_data.list[i];
            if(!room) continue;

            var rack_rate = parseInt(room.rack_rate);
            var hot_rate = rack_rate - rack_rate * fire_rate;
            var rates_html = "";
            var min_rate = 10000000;
            var min_stay = 0;

            for(var j=0; j<14; j++) {
                var rj =  j + this.day_ofs;
                var rate = parseInt(room.rates[rj]);

                if(rate > 0) {
                    min_rate = Math.min(rate, min_rate);
                }

                if(min_stay == 0 && room.min_stay[rj] > 1) {
                    min_stay = room.min_stay[rj];
                }

                if(rate) {
                    var d = this.dates[j].getDay();
                    var c = "item" + (d == 0 || d == 6 ? " week_end" : "");

                    if(min_stay >= 1) {
                        c += " green_border";
                    }
                    var link_html = min_stay >= 2 ? "<div class='link'></div>" : "";

                    rates_html += 
                        "<div class='" + c + "'  >" +
                        (rate < hot_rate ? "<div class='fire'></div>" : "") +
                        link_html +
                        this.getAllotmentSelectHTML(i, j) +
                        "<div onmouseover='$app("+this.id+").showDayPopup("+i+","+j+")' onmouseout='$app("+this.id+").hideDayPopup()'>" +
                        "<span class='p1'>$" + rack_rate + "</span>" +
                        "<span class='p2'>now</span>" +
                        "<span class='p3'>$" + parseInt(rate) + "</span>" +
                        "</div>" +

                        "</div>";
                } else {
                    rates_html += "<div class='item sold'></div>";
                }

                if(min_stay > 0) min_stay--;
            }

            // ext rates
            /*
            var ext_rates_html = "";
            for(var j=0; j<ext_systems.length; j++) {
                ext_rates_html += "<div class='ext_rates'>";
                for(var k=0; k<14; k++) {
                    var rate = this.getExtRate(i, ext_systems[j], k);
                    rate = rate ? "$" + rate : "n/a";
                    ext_rates_html += "<div>" + rate + "</div>";
                }
                ext_rates_html += "</div>";
            }
            */


            if(min_rate < rack_rate) {
                var discount = Math.round(100 * (rack_rate - min_rate) / rack_rate);
                var discount_html = "<div class='off_rate'>up to <span>" + discount + "%</span>off</div>";
            } else { 
                var discount_html = "<div class='off_rate_empty'></div>" 
            }


            var beds_html = [];
            for(var bed_name in room.beds) {
                beds_html.push(room.beds[bed_name] + " " + bed_name);
            }
            beds_html = beds_html.length ? beds_html.join(", ") : "n/a";


            var photo_link_html = room.photo == "" ? "" :
                "<div><a href='javascript:void(0);' onclick='$app(" + this.id + ").showRoomPhoto(" + i + ")'>Photo</a></div>";


            html += 
                "<div class='room'>" +
                    "<div class='room_info'>" +
                        "<div class='room_name'>" +
                        "<img class='motel_icon' src='http://" + this.motel.chain_host + "/static/themes/" + this.motel.chain_key + "/motel_icon.png'/>" +
                        room.room_name + 
                        "</div>" +
                        "<div>Max people: <strong>" + room.max_people + "</strong></div>" +
                        "<div>Beds: <strong>" + beds_html + "</strong></div>" +
                        photo_link_html +
//                        "<div id='app_ra_btn_toggle_rates" + this.id + "-" + i + "' class='btn_compare' onclick='$app(" + this.id + ").toggleExtRates(" + i + ")'>Compare prices</div>" +
                    "</div>" +

/*
                    "<div class='room_col2'>" +
                        discount_html +
                        "<div id='app_ra_ext_systems" + this.id + "-" + i + "' class='ext_systems' style='display: none'>" +
                        ext_systems_list_html +
                        "</div>" +
                    "</div>" +
*/

                    "<div class='room_rates_col'>" +
                        "<div class='room_rates'>" + rates_html + 
                            "<div id='app_ra_btn_book" + this.id + "-" + i + "' class='btn_book' style='display: none'" +
                                "onclick='$app(" + this.id + ").doBooking(" + i + ")' " +
                                "onmouseover='$app(" + this.id + ").showBookingInfo()' " +
                                "onmouseout='$app(" + this.id + ").hideBookingInfo()' ></div>" +
                        "</div>" +
/*
                        "<div id='app_ra_ext_rates" + this.id + "-" + i +"' style='display: none'>" + ext_rates_html + "</div>" +
*/
                    "</div>" +

                "</div>";
        }
        this.$["rooms_list"].innerHTML = html;
        if(this.booking) {
            this.updateBookBtnValue(this.booking.idx);
        }
    },



    // day without offset
    getExtRate: function(room_idx, ext_id, day) {
        var d = new Date(this.date_arrive.getTime());
        d.setDate(this.date_arrive.getDate() + day);
        var date = d.format("Y-m-d");
        var room_id = this.rooms_data.list[room_idx].room_id;
        for(var i=0; i<this.ext_rates[room_id].length; i++) {
            var er = this.ext_rates[room_id][i];
            if(er.date == date && er.ext_id == ext_id) return parseInt(er.rate);
        }
        return parseInt(this.rooms_data.list[room_idx].rates[day + this.day_ofs]);
    },




    getAllotmentSelectHTML: function(room_idx, day) {
        var d = new Date(this.date_arrive.getTime());
        d.setDate(this.date_arrive.getDate() + day);
        var date = d.format("Y-m-d");
        var room = this.rooms_data.list[room_idx];
        var max_value = parseInt(this.ext_allotments[room.room_id][date]) || parseInt(room.allotment);

        var booking_value = 0;
        if(this.booking && this.booking.idx == room_idx) {
            booking_value = this.booking.dates[d.getTime()] || 0;
        }

        var html = 
            "<select id='app_ra_day" + this.id + "-" + room_idx + "-" + day + "' " + 
            "onchange='$app(" + this.id + ").onSelectDate(" + room_idx + "," + day + ")'" +
            "onmouseover='$app("+this.id+").showAllotmentPopup(" + room_idx + "," + day + ")' " + 
            "onmouseout='$app("+this.id+").hideAllotmentPopup()'" +
            ">";
        for(var i=0; i<=max_value; i++) {
            var sel = i == booking_value ? " selected" : "";
            html += "<option " + sel + " value='" + i + "'>" + i + "</option>";
        }
        html += "</select>";

        return html;
    },



    // day popups
    showDayPopup: function(room_idx, day) {
        var room = this.rooms_data.list[room_idx];
        if(!room) return;

        this.renderDayPopup();
        this.showElement("day_popup");
        var el = this.$["day_popup"];

        var rj = day + this.day_ofs;

        el.innerHTML = 
            "Min Night Stay: " + room.min_stay[rj] + "<br>" +
            "Rate includes: " + room.people_in_rate[rj] + " person" + (room.people_in_rate[rj] > 1 ? "s" : "") + "<br>" +
            "Extra person rate: $"+room.extra_rates[rj]+"<br>";

        var pw = el.offsetWidth;
        var pos = core.browser.element.getPosition($("app_ra_day" + this.id + "-"+ room_idx + "-" + day));

        pos.top -= el.offsetHeight + 1;
        pos.left += 22;
        if(pos.left + pw > document.body.offsetWidth) {
            pos.left = document.body.offsetWidth - pw;
            pos.top -= 75;
        }
        el.style.left = pos.left + "px";
        el.style.top = pos.top + "px";
    },
    
    
    hideDayPopup: function() {
        this.hideElement("day_popup");
    },


    renderDayPopup: function() {
        if(this.$["day_popup"]) return;
        this.buildModel(
            document.body,
            { tag: "div", id: "day_popup", className: "room_info_popup" }
        );
    },


    // allotment hint
    showAllotmentPopup: function(room_idx, day) {
        this.renderAllotmentPopup();
        this.showElement("allotment_popup");

        var pel = this.$["allotment_popup"];
        var tel = $("app_ra_day" + this.id + "-"+ room_idx + "-" + day);
        var pos = core.browser.element.getPosition(tel);
        pos.left += Math.round((tel.offsetWidth - pel.offsetWidth)  * 0.5);
        pos.top -= pel.offsetHeight + 1;

        pel.style.left = pos.left + "px";
        pel.style.top = pos.top + "px";
    },

    hideAllotmentPopup: function() {
        this.hideElement("allotment_popup");
    },

    renderAllotmentPopup: function() {
        if(this.$["allotment_popup"]) return;
        this.buildModel(
            document.body,
            { tag: "div", id: "allotment_popup", className: "ra_allotment_popup", innerHTML: "How many rooms?" }
        );
    },





    // room photo

    showRoomPhoto: function(i) {
        var room = this.rooms_data.list[i];
        if(!room || !room.photo) return;
        if(room.photo.indexOf("/") == -1) room.photo = "/" + room.photo;
        var image_url = "http://" + this.motel.subdomain + "." + this.motel.chain_host + "/files" + room.photo;
        desktop.openImageBox([image_url], 0);
    },


    // ext rates
    /*
    toggleExtRates: function(i) {
        var el = $("app_ra_btn_toggle_rates" + this.id + "-" + i);
        if(el.ext_rates_visisble) {
            el.ext_rates_visisble = false;
            el.innerHTML = "Compare prices";
            $("app_ra_ext_rates" + this.id + "-" + i).style.display = "none";
            $("app_ra_ext_systems" + this.id + "-" + i).style.display = "none";
        } else {
            el.ext_rates_visisble = true;
            el.innerHTML = "Close compare";
            $("app_ra_ext_rates" + this.id + "-" + i).style.display = "block";
            $("app_ra_ext_systems" + this.id + "-" + i).style.display = "block";
        }
    },
        */



    // requests

    sendToServer: function(args) {
        this.showMsg(null);
        if(this.profile["motel_id"] == "") {
            this.showMsg("Motel ID not defined.");
            return;
        }
        this.blockUI();
        var p = {
            dialog: "motels_proxy",
            act: "get_rooms_availability",
            motel_id: this.profile["motel_id"],
            args: encodeURIComponent(core.transport.getEncodedData(args))
        }
        core.transport.send("/controller.php", p, this.onServerResponce.bind(this));
    },



    onServerResponce: function(r) {
        this.unblockUI();
        if(!r || r.status != "ok") {
            this.showMsg("Motel not found.");
            return;
        }
        var data = r.data;
        this.motel = r.motel;
//        this.ext_systems = data.ext_systems;
        this.ext_rates = data.ext_rates;
        this.setAllotmentsData(data.ext_allotments);

        if(!data || !data.date_ut) {
            this.hideElement("rooms");
            this.showElement("msg");
            this.$["msg"].innerHTML = "Error";
        }

        switch(data.act) {
            case "get_server_time":
                this.updateDatesFromServer(data.date_y,data.date_m,data.date_d);
                break;

            default:
                switch(this.append_data_dir) {
                    case "r":
                        this.days_loaded += 14;
                        for(var i=0; i<data.list.length; i++) {
                            var rd = this.rooms_data.list[i];
                            rd.rates = rd.rates.concat(data.list[i].rates);
                            rd.extra_rates = rd.extra_rates.concat(data.list[i].extra_rates);
                            rd.people_in_rate = rd.people_in_rate.concat(data.list[i].people_in_rate);
                            rd.min_stay = rd.min_stay.concat(data.list[i].min_stay);
                        }
                        break;
    
                    case "l":
                        this.days_loaded += 14;
                        for(var i=0; i<data.list.length; i++) {
                            var rd = this.rooms_data.list[i];
                            rd.rates = data.list[i].rates.concat(rd.rates);
                            rd.extra_rates = data.list[i].extra_rates.concat(rd.extra_rates);
                            rd.people_in_rate = data.list[i].people_in_rate.concat(rd.people_in_rate);
                            rd.min_stay = data.list[i].min_stay.concat(rd.min_stay);
                        }
                        this.EXTRADATE = new Date(Date.UTC(data.date_y,data.date_m-1,data.date_d,0,0,0));
                        break;
    
                    default:
                        this.date_arrive = new Date(Date.UTC(data.date_y,data.date_m-1,data.date_d,0,0,0));
                        this.rooms_data = data;
                        break;
                }

                this.append_data_dir = false;
                this.refresh();
                break;
        }
    },



    setAllotmentsData: function(data) {
        this.ext_allotments = {};
        for(var room_id in data) {
            var allotments = {};
            var l = data[room_id];
            for(var i=0; i<l.length; i++) {
                allotments[l[i].date] = l[i].allotment;
            }
            this.ext_allotments[room_id] = allotments;
        }
    },


    // UI

    showMsg: function(msg) {
        if(msg) {
            this.$["msg"].innerHTML = msg;
            this.hideElement("rooms");
            this.showElement("msg");
        } else {
            this.hideElement("msg");
            this.showElement("rooms");
        }
    }


}
core.apps.room_availability.extendPrototype(core.components.html_component);
core.apps.room_availability.extendPrototype(core.components.desktop_app);