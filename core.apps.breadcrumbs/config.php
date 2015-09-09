<?

$config["js_apps"]["core.apps.breadcrumbs"] = array(
    'general' => array(
        'title' => 'Breadcrumbs',
        'name' => 'breadcrumbs',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_NAVIGATE,
        'description' => ''
    ),
    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("breadcrumbs.js")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("breadcrumbs.js")
        ),


        USERTYPE_GUEST => array(
            "code" => array("breadcrumbs.js")
        )
    )

)

?>