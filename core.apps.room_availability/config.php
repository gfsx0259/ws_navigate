<?

    $config["js_apps"]["core.apps.room_availability"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "room_availability.js",
                    "room_availability_booking.js",
                    "room_availability.admin.js"
                ),
                "templates" => array(
                    "templates/room_availability.xml"
                ),
                "styles" => array(
                    "style.css"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "room_availability.js",
                    "room_availability_booking.js"
                ),
                "templates" => array(
                    "templates/room_availability.xml"
                ),
                "styles" => array(
                    "style.css"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array(
                    "room_availability.js",
                    "room_availability_booking.js"
                ),
                "templates" => array(
                    "templates/room_availability.xml"
                ),
                "styles" => array(
                    "style.css"
                )
            )
        )

    );

?>