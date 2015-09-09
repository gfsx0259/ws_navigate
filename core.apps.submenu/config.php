<?

$config["js_apps"]["core.apps.submenu"] = array(

        'general' => array(
            'title' => 'Submenu',
            'name' => 'submenu',//should be like 3th part of folder
            'version' => '1.0.0',
            'icon' => 'icon.png',
            'category' => CATEGORY_NAVIGATE,
            'description' => ''
        ),

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