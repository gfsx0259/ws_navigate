core.apps.site_map = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: ""
    }


};


core.apps.site_map.prototype = {

    onOpen: function() {
        this.$["content"].innerHTML = "Loading...";
        core.transport.send("/sitemap.txt", false, this.serverResponse.bind(this));
    },


    serverResponse: function(html) {
        this.$["content"].innerHTML = html;
    }

};
core.apps.site_map.extendPrototype(core.components.html_component);
core.apps.site_map.extendPrototype(core.components.desktop_app);