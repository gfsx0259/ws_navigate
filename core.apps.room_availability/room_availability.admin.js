core.apps.room_availability.extendPrototype({

    settingsBlocks: [
        { title: "Motel ID:", 
          controls: [
            { tag: "wsc_text", id: "inp_motel_id" }
          ]}
    ],


    fillSettingsForm: function() {
        this.$["inp_motel_id"].value = this.profile["motel_id"];    
    },


    processSettingsForm: function() {
        var id = parseInt(this.$["inp_motel_id"].value, 10) || "";
        this.$["inp_motel_id"].value = id;
        this.profile["motel_id"] = id;
    },


    onSettingsUpdated: function() {
        this.booking = false;
        this.day_ofs = 0;
        this.days_loaded = 14;
        this.getTodayFromServer();
    }

});