<?

$config["js_apps"]["core.apps.site_map"] = array(

    'general' => array(
        'title' => 'Site map',
        'name' => 'site_map',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_NAVIGATE,
        'description' => '',
        'depends' => [
            'ecommerce',
            'ecommerce_product',
            'ecommerce_category',
            'ecommerce_brands_menu',
            'menu'
        ]
    ),

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