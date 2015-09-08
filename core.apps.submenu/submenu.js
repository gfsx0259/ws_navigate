core.apps.submenu = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        itemId: null,
        layout: 0
    }

}


core.apps.submenu.prototype = {


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.refresh();
    },


    findItem: function(id, node) {
        if(id == "root") {
            var res = {
                title: "",
                childs: core.data.main_menu 
            }
            return res;
        }

        if(!node) node = core.data.main_menu;
        var res = null;
        for(var i=0; i<node.length; i++) {
            if(node[i].id == id) {
                res = node[i];
            } else {
                res = this.findItem(id, node[i].childs);
            }
            if(res && res.published == 1) return res;
        }
        return null;
    }


}
core.apps.submenu.extendPrototype(core.components.html_component);
core.apps.submenu.extendPrototype(core.components.desktop_app);