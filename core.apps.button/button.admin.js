core.apps.button.extendPrototype({

    onFirstRun: function() {
        this.showSettings();
    },


    settingsBlocks: [
        { title: "Height:", 
          controls: [
            { tag: "wsc_size", id: "inp_height", hide: "w" }
          ]},

        { title: "Align:",
          controls: [
            { tag: "wsc_select", id: "inp_align", 
              options: [
                { text: "left", value: "left" },
                { text: "center", value: "center" },
                { text: "right", value: "right" }
              ]}
          ]},

        { title: "Link:", 
          controls: [
            { tag: "wsc_text", id: "inp_link" }
          ]},

        { title: "Select page:", 
          controls: [
            { tag: "wsc_select", id: "inp_link_page",
              events: { onchange: "onLinkPageChanged" },
              options: [
                { text: "...", value: "" }
              ]},
            { tag: "div",
              childs: [
                { tag: "span", innerHTML: "or " },
                { tag: "a", events: { onclick: "onSelectLinkFileClick" },
                  innerHTML: "select file" }
              ]}
          ]},


        { title: "Normal state:", 
          controls: [
            { tag: "wsc_file", id: "inp_file", type: "pictures" },
          ]},

        { title: "Over state:", 
          controls: [
            { tag: "wsc_file", id: "inp_file_over", type: "pictures" },
          ]},

        { title: "Pressed state:", 
          controls: [
            { tag: "wsc_file", id: "inp_file_pressed", type: "pictures" },
          ]},
    ],


    onSettingsRendered: function() {
        if(core.usertype < USERTYPE_ADMIN) {
            this.hideElement("lnk_edit_image");
        }
        var pl = core.data.pages_list;
        var opts = [ { text: "...", value: "" } ];
        for(var i=0; i<pl.length; i++) {
            opts.push({ text: pl[i].name, value: pl[i].url });
        }

        this.$["inp_link_page"].setOptions(opts);
    },


    fillSettingsForm: function() {
        this.$["inp_height"].setValue({ height: this.profile["height"] });
        this.$["inp_link"].value = this.profile["link"];
        this.$["inp_align"].value = this.profile["align"] || "center";
        this.$["inp_link_page"].setValue("");

        this.$["inp_file"].setValue(this.profile["path"] || "");
        this.$["inp_file_over"].setValue(this.profile["path_over"] || "");
        this.$["inp_file_pressed"].setValue(this.profile["path_pressed"] || "");
    },



    processSettingsForm: function() {
        this.profile["height"] = this.$["inp_height"].value.height;
        this.profile["link"] = this.$["inp_link"].value;
        this.profile["align"] = this.$["inp_align"].value;

        this.profile["path"] = this.$["inp_file"].value;
        this.profile["path_over"] = this.$["inp_file_over"].value;
        this.profile["path_pressed"] = this.$["inp_file_pressed"].value;
    },


    onSettingsUpdated: function() {
        this.refresh();
    },




    onLinkPageChanged: function() {
        this.$["inp_link"].value = "/" + this.$["inp_link_page"].value + ".html";
    },

    onSelectLinkFileClick: function() {
        desktop.openFilesManager(this.onLinkFileSelected.bind(this));
    },

    onLinkFileSelected: function(file) {
        this.$["inp_link_page"].value = "";
        this.$["inp_link"].value = core.common.getUserFile(file);
    },

    

    getUsedImages: function() {
        return [ 
            { file: this.profile["path"], title: this.profile["title"] } 
        ];
    }


});