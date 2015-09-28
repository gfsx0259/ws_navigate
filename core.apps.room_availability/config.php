<?

$config["js_apps"]["core.apps.room_availability"] = array(

    'general' => array(
        'title' => 'Room availability',
        'name' => 'room_availability',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_NAVIGATE,
        'description' => ''
    ),

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