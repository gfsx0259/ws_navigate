core.apps.room_availability.extendPrototype({




    onSelectDate: function(idx, day_num) {
        var el = this.getDayInput(idx, day_num);
        el.blur();

        var d = new Date(this.date_arrive.getTime());
        d.setDate(this.date_arrive.getDate() + day_num);

        if(!this.booking || this.booking.idx != idx) {
            this.unselectAll();
            this.booking = {
                idx: idx,
                dates: {}
            }
        }
        if(el.value == 0) {
            delete(this.booking.dates[d.getTime()]);
        } else {
            this.booking.dates[d.getTime()] = el.value;
        }
        this.updateBookBtnValue(idx);
    },


    updateBookBtnValue: function(idx) {
        var el = $("app_ra_btn_book" + this.id + "-" + idx);
        if(!el) return;

        var is_visible = this.booking && this.booking.idx == idx;
        if(this.booking) {
            var ctn = 0;
            for(var i in this.booking.dates) {
                ctn++;
            }
        }
        if(!ctn) is_visible = false;
        el.style.display = is_visible ? "block" : "none";
    },


    unselectAll: function() {
        var b = this.booking;
        if(!b) return;
        for(var i=0; i<14; i++) {
            this.setDayValue(b.idx, i, 0);
        }
        this.booking = false;
        var el = $("app_ra_btn_book" + this.id + "-" + b.idx);
        el.style.display = "none";
    },





    // booking

    doBooking: function() {
        if(!this.booking || !this.booking.dates) return;

        var t_start = this.EXTRADATE.getTime();
        var periods = [];
        for(var date in this.booking.dates) {
            var idx = Math.round((date - t_start) / 86400000);
            periods.push({ start: idx, len: 1, qty: this.booking.dates[date]});
        }


        var start = Math.round(this.EXTRADATE.getTime() / 1000);
        var params = [];
        for(var i=0; i<periods.length; i++) {
            var p = periods[i];
            if(!this.isPeriodCorrect(this.booking.idx, p.start, p.start + p.len - 1)) return;
            params.push(start + (p.start * 86400) + "-" + p.len + "-" + p.qty);
        }

        var room = this.rooms_data.list[this.booking.idx];
        var p = 
            "&na=0" + 
            "&periods=" + params.join(";") +
            "&rooms=" + room.room_id +
            "&motel=" + room.motel_id;

        window.open("https://" + this.motel.chain_host + "/?dialog=booking&action=prepare" + p);
    },



    isPeriodCorrect: function(room_idx, s1, s2) {
        var room = this.rooms_data.list[room_idx];
        var min_stay = this.rooms_data.list[room_idx].min_stay;
        for(var i=s1; i<=s2; i++) {
            var ms = min_stay[i];
            if(ms <= 1) continue;

            var c = 0;
            for(var j=0; j<ms; j++) {
                var d = i+j;
                if(d <= s2 && d >= s1 && min_stay[d] <= ms) {
                    c ++;
                } else {
                    d = i-1;
                    if(d <= s2 && d >= s1 && min_stay[d] <= ms) {
                        c ++;
                    }
                }
            }
            if(c < ms) {
                var problem_date = this.dates[i];
                var dstr = 
                    core.common.weekdays_short[problem_date.getDay()] + " " +
                    problem_date.getDate() + " " +
                    core.common.monthes_short[problem_date.getMonth()];
                desktop.modal_dialog.alert("Dates near " + dstr + " has min stay " + ms + " days. Please extend selection.");
                return false;
            }
        }
        return true;
    },


    showBookingInfo: function() {
        //TODO: what must be there?
        return;
        var b = this.booking;
        var room = this.rooms_data.list[b.idx];
        var d = new Date(this.EXTRADATE.getTime() + b.start * 86400000);
         
        $("app_ra_bi_date_arrive").innerHTML = d.format("d-M-Y");

        var d = b.end - b.start + 1;
        $("app_ra_bi_duration").innerHTML = d + " day" + ( d > 1 ? "s" : "");

        var total = 0;
        for(var i=b.start; i<=b.end; i++) {
            total += parseInt(room.rates[i]);
        }
        $("app_ra_bi_total").innerHTML = total;

        var el = $("app_ra_booking_info");
        var btn = $("app_ra_btn_book" + this.id + "-" + b.idx);
        var pos = core.browser.element.getPosition(btn);

        el.style.display = "block";
        el.style.top = pos.top - el.offsetHeight - 2 + "px";

        el.style.left = pos.left + Math.round(0.5 * (btn.offsetWidth - el.offsetWidth)) + "px";
    },


    hideBookingInfo: function() {
        $("app_ra_booking_info").style.display = "none";
    },





    // sys

    setDayValue: function(idx, day_num, v) {
        var el = this.getDayInput(idx, day_num);
        if(el) el.value = v;
    },


    getDayInput: function(idx, day_num) {
        return $("app_ra_day" + this.id + "-" + idx + "-" + day_num);
    }


});