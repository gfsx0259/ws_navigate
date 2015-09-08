<?

    $config["js_apps"]["core.apps.site_search"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "site_search.js"
                ),
                "templates" => array(
                    "templates/content.xml",
                    "templates/dropdown.xml"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "site_search.js"
                ),
                "templates" => array(
                    "templates/content.xml",
                    "templates/dropdown.xml"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array(
                    "site_search.js"
                ),
                "templates" => array(
                    "templates/content.xml",
                    "templates/dropdown.xml"
                )
            )
        )

    )


?>