core.apps.submenu.extendPrototype({


    refresh: function() {
        var html = this.getMenuHTML();
        if(this.profile["layout"] == 1) {
            html = "<div class='body_menu'>" + html + "</div>";
        }
        this.$["content"].innerHTML = html;
    },



    getMenuHTML: function() {
        var html = "";


        if(this.profile["itemId"] != null) {
            var mi = this.findItem(this.profile["itemId"]);
            if(mi != null) {
                var items = mi.childs;
                for(var i=0; i<items.length; i++) {
                    if(items[i].published == 0) continue;
                    var url = items[i].url;
                    var t = this.formatTitle(items[i]);
                    if(url != core.data.page_file) {
                        if(url == "") {
                            url = "#";
                        } else if(url.indexOf(".") == -1) {
                            url = "/"  + url + ".html";
                        }
                        var ihtml = "<a href='"+url+"' "+(items[i].blank_page == "1" ? "target='_new'" : "" )+">" + t + "</a>";
                        var shtml = "";
                    } else {
                        var ihtml = "<span>" + t + "</span>";
                        var shtml = " class='active'";
                    }

                    html += "<li" + shtml + ">" + ihtml + "</li>";
                }
            }
        }
        return "<ul class='submenu'>" + html + "</ul>";
    },


    formatTitle: function(mi) {
        return mi.hint ? "<strong>" + mi.title + "</strong> <span class='menu_by-line'>" +  mi.hint + "</span>" : mi.title;
    }


});