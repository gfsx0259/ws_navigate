core.apps.breadcrumbs = function (args) {

    this.defaultProfile = {
        title: "",
        app_style: ""
    }

};


core.apps.breadcrumbs.prototype = {


    home_page_mi: {
        url: "index",
        title: "Home",
        type: "std"
    },


    buildContent: function (el) {
        this.buildModel(el,
            {tag: "div", id: "box", className: "breadcrumbs"}
        );


        if (core.data["page_file"] == "index" && core.data["page_id"] == "") return;

        this.path = [];
        this.links = [];


        if (this.findItem(core.data.page_file)) {
            if (this.path[0].url != "index") {
                this.path.unshift(this.home_page_mi);
            } else {
                this.path[0].title = "Home";
            }
            for (var i = 0; i < this.path.length - 1; i++) {
                this.links.push(this.formatLink(this.path[i]));
            }
            this.links.push("<span>" + this.path[i++].title + "</span>");
        } else {
            this.links.push(this.formatLink(this.home_page_mi));
            this.links.push("<span>" + core.data.page_title + "</span>");
        }

        this.$["box"].innerHTML = this.links.join(" :: ");
        this.$["box"].childNodes[0].className += " first_item";
    },


    findItem: function (url, node) {
        if (!node) node = core.data.main_menu;
        for (var i = 0; i < node.length; i++) {
            if (node[i].url == url || this.findItem(url, node[i].childs)) {
                this.path.unshift(
                    {
                        title: node[i].title,
                        url: node[i].url,
                        type: node[i].type,
                        blank_page: "0"
                    }
                );
                return true;
            }
        }
        return false;
    },


    formatLink: function (mi) {
        var url = mi.url;
        if (mi.type == "std" || mi.type == "doc") {
            url = "/" + url + ".html";
        } else if (mi.type != "external") {
            url = "/" + url;
        }
        return "<a href='" + url + "'>" + mi.title + "</a>"
    }

};
core.apps.breadcrumbs.extendPrototype(core.components.html_component);
core.apps.breadcrumbs.extendPrototype(core.components.desktop_app);