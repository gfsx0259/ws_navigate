<?

    $config["js_apps"]["core.apps.submenu"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "submenu.js",
                    "submenu.std.js",
                    "submenu.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "submenu.js",
                    "submenu.std.js"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array(
                    "submenu.js",
                    "submenu.std.js"
                )
            )
        )

    )


?>