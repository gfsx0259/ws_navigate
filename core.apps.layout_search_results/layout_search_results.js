core.apps.layout_search_results = function(args) {

    this.title = "Search results";

    var sr = core.data.search_results;

    try {
        if(desktop.$["inp_site_search_q"]) {
            desktop.$["inp_site_search_q"].value = sr.q;
        }
        if($("inp_site_search_" + sr.mode)) {
            $("inp_site_search_" + sr.mode).checked = true;
        }
    } catch(e) {}

    this.buildModel(args.parentElement,
        { tag: "div", className: "search_results",
          childs: [
            { tag: "form", method: "get",
              action: "/search/",
              display: core.data.main_menu_flags && core.data.main_menu_flags.indexOf("f") != -1,
              childs: [
                { tag: "div",
                  childs: [
                    { tag: "input", type: "text", 
                      style: { width: "200px" },
                      name: "q", 
                      id: "inp_q" },

                    { tag: "input", type: "submit", value: " Find " }
                  ]},
                { tag: "span", innerHTML: "Search in " },
                { tag: "select",
                  name: "smode",
                  id: "inp_mode",
                  style: { width: "70px" },
                  options: [
                    { value: "site", text: "site" },
                    { value: "forum", text: "forum" }
                  ]}
              ]},

            { tag: "div", className: "pager",
              style: { display: "none"},
              id: "pager",
              childs: [
                { tag: "span", innerHTML: "Go to page " }
              ]},
            { tag: "div", id: "items" }
          ]}
    );
    this.$["inp_mode"].value = sr.mode;
    this.$["inp_q"].value = sr.q;




    if(sr.data.length) {
        this.updatePager();

        switch(sr.mode) {
            case "site":
                for(var i=0; i<sr.data.length; i++) {
                    var url = "http://" + core.data.http_host + "/" + sr.data[i].url + ".html";
                    this.buildModel(this.$["items"],
                        { tag: "div",
                          className: "item",
                          style: { marginBottom: "12px" },
                          childs: [
                            { tag: "div", className: "title",
                              childs: [
                                { tag: "span", 
                                  innerHTML: i + 1 + ". " },

                                { tag: "a", href: url,
                                  innerHTML: sr.data[i].title }
                              ]},

                            { tag: "a", href: url, innerHTML: url }
                          ]}
                    );
                }
                break;

            case "forum":
                for(var i=0; i<sr.data.length; i++) {
                    var url = "http://" + core.data.http_host + "/forum/?view=topic&id=" + sr.data[i].id;
                    this.buildModel(this.$["items"],
                        { tag: "div",
                          className: "item",
                          style: { marginBottom: "12px" },
                          childs: [
                            { tag: "div", className: "title",
                              childs: [
                                { tag: "span", 
                                  innerHTML: i + 1 + ". " },

                                { tag: "a", href: url,
                                  innerHTML: sr.data[i].title }
                              ]},
                            { tag: "a", href: url, innerHTML: url }
                          ]}
                    );
                }
                break;
        }
    } else {
        this.$["items"].innerHTML = "<div class='no_columns'>Nothing found</div>";
    }


};


core.apps.layout_search_results.prototype = {


    updatePager: function() {
   
        var sr = core.data.search_results;

        var pages = Math.ceil(sr.total / sr.per_page);
        var page = Math.floor(sr.ofs / sr.per_page);

        if(pages < 2) {
            this.hideElement("pager");
            return;
        }

        var url = 
            "http://" + core.data.http_host + 
            "/search/?q=" + escape(sr.q) + 
            "&smode=" + sr.mode +
            "&ofs=";

        var p = page;
        if(p > pages) p = pages;
        var items = [];

        if(pages > 7) {
            items.push({ text: "first", ofs: 0 });
        }
        for(var i=-3; i<4; i++) {
            var pp = p + i;
            if(pp >= 0 && pp < pages) {
                items.push({ text: pp + 1, ofs: pp});
            }
        }
        if(pages > 7) {
            items.push({ text: "last", ofs: pages - 1});
        }

        if(items) {
            this.showElement("pager");
            for(var i=0; i<items.length; i++) {
                this.buildModel(this.$["pager"],
                    items[i].ofs != sr.ofs ?
                    { tag: "a", href: "void",
                      innerHTML: items[i].text,
                      href: url + (items[i].ofs * sr.per_page) }
                    :
                    { tag: "span", innerHTML: items[i].text }
                );
            }
        }
    }

};

core.apps.layout_search_results.extendPrototype(core.components.html_component);