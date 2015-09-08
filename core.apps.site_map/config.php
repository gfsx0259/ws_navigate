<?

    $config["js_apps"]["core.apps.site_map"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array("site_map.js")
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("site_map.js")
            ),


            USERTYPE_GUEST => array(
                "code" => array("site_map.js")
            )
        )

    )


?>