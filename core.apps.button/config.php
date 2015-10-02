<?

$config["js_apps"]["core.apps.button"] = array(
    'general' => array(
        'title' => 'Button',
        'name' => 'button',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_NAVIGATE,
        'description' => ''
    ),
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