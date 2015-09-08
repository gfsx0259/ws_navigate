core.apps.button = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        height: 50,
        link: "",
        path:null,
        path_over:null,
        path_pressed:null,
        align: "center"
    }
}


core.apps.button.prototype = {


    // sys

    buildContent: function(el) {
        this.buildModel(this.$["content"],
            { tag: "div", id: "box",
              style: { 
                verticalAlign: "middle", 
                padding:"0px", 
                height: 
                this.profile["height"]+"px", 
                lineHeight: this.profile["height"]+"px"
              },
              childs:[ 
                { tag:"a", href: this.profile["link"],
                  id: "link",
                  style: { background: "transparent", color: "transparent", border: 0, cursor: "pointer" },
                  childs:[
                    { tag: "img", 
                      id: "s_image_box",
                      style: {width:"auto" ,height: this.profile["height"]}, 
                      events: {
                        onmouseover: [ "setImage", "path_over" ],
                        onmousedown: [ "setImage", "path_pressed" ], 
                        onmouseup: [ "setImage", "path" ],
                        onmouseout: [ "setImage", "path" ]
                      } 
                    }
                  ]}
              ]}
        );
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.$["window"].style.overflow = "hidden";
        this.refresh();
    },

    

    refresh: function() {
        this.$["link"].href = this.profile["link"];
        this.$["box"].style.textAlign = this.profile["align"];
        this.setImage(null, "path");
    },    



    // button code

    setImage: function(e, key) {
        var h = this.profile["height"] + "px";
        this.$["box"].style.height = h;

        var file = this.profile[key];
        var el = this.$["s_image_box"];
        if(file) {
            el.src = core.common.getUserFile(file);
        }
        el.style.height = h;
        this.updateImagePos();
    },


    updateImagePos: function(){
        var ICW = this.$["box"].clientWidth;
        var DCW = this.$["s_image_box"].clientWidth;
        if ( ICW< DCW){
           var IL =  -(DCW/2 - ICW/2);
           this.$["s_image_box"].style.position = "absolute";
           this.$["s_image_box"].style.left = IL + "px";
        }else{
           this.$["s_image_box"].style.position = "static";
        }
     }

}
core.apps.button.extendPrototype(core.components.html_component);
core.apps.button.extendPrototype(core.components.desktop_app);