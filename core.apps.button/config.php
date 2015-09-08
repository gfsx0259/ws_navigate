<?

    $config["js_apps"]["core.apps.button"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "button.js",
                    "button.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("button.js")
            ),


            USERTYPE_GUEST => array(
                "code" => array("button.js")
            )

        )
    )

?>