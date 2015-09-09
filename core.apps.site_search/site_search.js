core.apps.site_search = function(args) {

    this.defaultProfile = {
        title: ""
    };


    this.per_page = 20;
    this.first_result_count = 5;
    this.empty_q = "search...";

};


core.apps.site_search.prototype = {


    buildContent: function(el) {
        this.displayTpl(el, "site_search_content");
    },

    onAppStyleChanged: function() {
        this.$["popup_wrapper"].className = this.getAppStyleSelector();
    },


    onAppStyleChanged: function() {
        if(!this.$["popup_wrapper"]) return;
        this.$["popup_wrapper"].className = this.getAppStyleSelector();
    },

    onOpen: function() {
        this.setTitle(this.profile["title"]);
        var q = core.browser.cookies.get("site_search_q");
        if(q) {
            this.$["inp_q"].value = q;
        }
        this.onInpBlur();
    },



    onInpBlur: function() {
        var q = this.$["inp_q"].value.trim();        
        this.$["inp_q"].value = q;
        if(q == "") {
            this.$["inp_q"].value = this.empty_q;
            this.$["inp_q"].className = "empty";
        } else {
            this.$["inp_q"].className = "";
        }
    },


    onInpFocus: function() {
        var q = this.$["inp_q"].value.trim();        
        if(q == this.empty_q) {
            this.$["inp_q"].value = "";
        }
        if(this.$["inp_q"].value != "" && !this.drop_down_visible) {
            this.onSearchClick();
        }
        this.$["inp_q"].className = "";
    },



    onSearchClick: function(e) {
        var q = this.$["inp_q"].value.trim();
        if(q == this.empty_q) {
            q = "";
        }

        core.browser.cookies.set("site_search_q", q);

        if(!q || q.length < 2) {
            this.hideDropdown();
            return;
        }
        if(this.q == q) {
            this.showDropdown();
            return;
        }
        this.$["inp_q"].blur();

        this.q = q;

        this.$["btn_search"].disabled = true;
        this.$["inp_q"].disabled = true;
        this.showDropdown();
        this.showSection("loading");

        var p = {
            dialog: "site_search",
            q: this.q,
            layout_mode: core.data.layout_mode
        };
        core.transport.send("/controller.php", p, this.onSearchAllResponse.bind(this));
    },



    onSearchAllResponse: function(r) {
        this.$["btn_search"].disabled = false;
        this.$["inp_q"].disabled = false;

        if(!r || r.status != "ok") {
            this.hideDropdown();
            return;
        }

        this.$["inp_q"].value = this.q;
        this.data = r.data;
        this.showAllResults();

        this.$["inp_q"].focus();
        this.$["inp_q"].select();
    },


    showAllResults: function() {
        var keys = [ "products", "categories", "brands", "pages" ];
        var empty_results = true;
        for(var i=0; i<keys.length; i++) {
            var key = keys[i];

            var s = this.data[key];
            if(s.total > 0) {
                empty_results = false;
                var html = "";
                for(var j=0; j<s.data.length; j++) {
                    html += "<a href='" + s.data[j].url + "'>" + s.data[j].title + "</a>";
                }
                this.$[key + "_list"].innerHTML = html;
                this.$["lnk_more_" + key].style.display = s.total > this.first_result_count ? "" : "none";

                this.showElement(key);
            } else {
                this.hideElement(key);
            }
        }

        if(empty_results) {
            this.showSection("empty_results");
        } else {
            this.showSection("all");
        }

    },



    onMoreClick: function(e) {
        e = core.browser.event.fix(e);
        this.search_target = e.target.panel;
        this.search();
    },




    search: function(p) {
        this.$["btn_search"].disabled = true;
        this.$["inp_q"].disabled = true;
        this.showDropdown();
        this.showSection("loading");

        if(!p) p = {
            offset: 0,
            items_count: this.per_page
        };
        p.target = this.search_target;
        p.dialog = "search";
        p.q = this.q;
        core.transport.send("/controller.php", p, this.onSearchResponse.bind(this));        
    },



    onSearchResponse: function(r) {
        this.$["btn_search"].disabled = false;
        this.$["inp_q"].disabled = false;
        this.showSection("more");

        if(!r || r.status != "ok") {
            this.hideDropdown();
            return;
        }

        this.$["inp_q"].value = this.q;
        this.$["more_title"].innerHTML = r.target;
        this.data_more = r.data;
        this.showResults();
    },


    showResults: function() {
        if(this.data_more.total < this.per_page) {
            this.hideElement("pager");
        } else {
            this.showElement("pager");
            this.updatePager();
        }
        var html = "";
        for(var i=0; i<this.data_more.data.length; i++) {
            html += "<a href='" + this.data_more.data[i].url + ".html'>" + this.data_more.data[i].title + "</a>";
        }
        this.$["more_list"].innerHTML = html;

    },



    updatePager: function() {
        if(!this.pager) {
            var p = {
                per_page: this.per_page,
                parent: this.$["pager"],
                callback: this.pagerCallback.bind(this)
            };
            this.pager = new core.objects.pager(p);
        }
        this.pager.setData(this.data_more.offset, this.data_more.total);
    },


    pagerCallback: function(offset) {
        var p = {
            offset: offset,
            items_count: this.per_page
        };
        this.search(p);
    },



    onBackClick: function() {
        this.showSection("all");
    },


    // dropdown
    renderDropdown: function() {
        if(!this.$["dropdown"]) {
            this.displayTpl(document.body, "site_search_dropdown");
            this.onAppStyleChanged();
        }
    },


    showDropdown: function() {
        this.drop_down_visible = true;
        this.renderDropdown();

        var pos = core.browser.element.getPosition(this.$["wrapper"]);
        this.showElement("popup_wrapper");
        this.$["dropdown"].style.top = 4 + pos.top + pos.height + "px";
        this.$["dropdown"].style.left = pos.left + this.$["wrapper"].offsetWidth - this.$["dropdown"].offsetWidth + "px";
//        core.browser.cookies.set("search_results_visible", 1);
    },


    hideDropdown: function() {
        this.drop_down_visible = false;
//        core.browser.cookies.set("search_results_visible", 0);
        if(!this.$["dropdown"]) return;
        this.hideElement("popup_wrapper");
    },



    showSection: function(name) {
        this.hideElements(["section_loading", "section_empty_results", "section_all", "section_more"]);
        this.showElement("section_" + name);
    }

};
core.apps.site_search.extendPrototype(core.components.html_component);
core.apps.site_search.extendPrototype(core.components.desktop_app);