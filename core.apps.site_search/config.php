<?

$config["js_apps"]["core.apps.site_search"] = array(

    'general' => array(
        'title' => 'Site search',
        'name' => 'site_search',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_NAVIGATE,
        'description' => '',
        'depends' => [
            'ecommerce/ecommerce',
            'ecommerce/ecommerce_product',
            'ecommerce/ecommerce_category',
            'ecommerce/ecommerce_brands_menu',
            'layout_search_results'
        ]
    ),

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