core.apps.submenu.extendPrototype({

    onFirstRun: function() {
        this.showSettings();
    },

    // settings

    settingsBlocks: [
        { title: "Layout:",
          primary: true,
          controls: [
            { tag: "wsc_select",
              id: "inp_layout",
              options: [
                { text: "Standard", value: 0 },
                { text: "Advanced", value: 1 }
              ]}
          ]},

        { title: "Select node:",
          controls: [
            { tag: "wsc_box",
              childs: [
                { tag: "div", className: "tree_view",
                  id: "tree",
                  style: { width: "auto", height: "150px" } }
              ]}
          ]}
    ],


    onSettingsRendered: function() {
        var menu_tree = [
            { id: "root",
              title: "Root",
              childs: core.data.main_menu }
        ]
        this.renderNode(this.$["tree"], menu_tree);
        this.updateNodeClasses(core.data.main_menu);
        this.selectedItemId = null;
    },


    fillSettingsForm: function() {
        this.selectTreeItem(this.profile["itemId"]);
        this.$["inp_layout"].setValue(this.profile["layout"]);
    },


    processSettingsForm: function() {
        this.profile["itemId"] = this.selectedItemId;
        this.profile["layout"] = this.$["inp_layout"].value;
    },


    onSettingsUpdated: function() {
        this.refresh();
    },





    // menu tree

    selectTreeItem: function(id) {
        var oid = this.selectedItemId;
        if(oid != null && this.$["item" + oid]) {
            this.$["title" + oid].className = "";
        }
        if(this.$["title" + id]) {
            this.$["title" + id].className = "active";
            var title = id == "root" ? "" : this.$["title" + id].innerHTML;
        }
        this.selectedItemId = id;
    },


    renderNode: function(pel, node) {
        var id = null;
        for(var i=0; i<node.length; i++) {
            if(node[i].published == 0) continue;
            var id = node[i].id;

            this.buildModel(pel,
                { tag: "div", className: "item",
                  id: "item" + id,
                  childs: [
                    { tag: "div", className: "caption",
                      childs: [
                        { tag: "img", id: "pic" + id,
                          events: { onclick: ["onPicClick", id ] } },
                        { tag: "a", id: "title" + id,
                          className: this.profile["itemId"] == id ? "active" : "",
                          innerHTML: node[i].title,
                          href: "void",
                          events: { onclick: ["onSelectItem", id ] } }
                      ]},
                    { tag: "div", className: "childs",
                      isVisible: true,
                      id: "childs" + id }
                  ]}
            );
            if(node[i].childs.length) {
                this.renderNode(this.$["childs" + id], node[i].childs);
            }
        }
    },


    updateNodeClasses: function(node) {
        for(var i=0; i<node.length; i++) {
            if(node[i].published == 0) continue;
            var picSrc = "";
            var childsBg = false;
            if(node[i].childs.length) {
                picSrc = "minus";
                this.updateNodeClasses(node[i].childs);
                childsBg = "line1";
            } else {
                picSrc = "line";
            }

            if(i == node.length - 1) {
                childsBg = "";
                picSrc += "2";
            } else {
                picSrc += "3";
            }
            this.$["pic" + node[i].id].src = "/static/menu_editor/" + picSrc + ".gif";
            this.$["childs" + node[i].id].style.background = childsBg ? "url(/static/menu_editor/" + childsBg + ".gif) repeat-y" : "";
        }
    },


    onPicClick: function(e, id) {
        var c = this.$["childs" + id];
        c.style.display = c.isVisible ? "none" : "block";

        var src = this.$["pic" + id].src;
        if(c.isVisible) {
            this.$["pic" + id].src = src.replace("minus", "plus");
        } else {
            this.$["pic" + id].src = src.replace("plus", "minus");
        }
        c.isVisible = !c.isVisible;
    },



    onSelectItem: function(e, id) {
        this.selectTreeItem(id);
    },


    getUsedSubmenus: function() {
        return this.profile["itemId"];
    }


});