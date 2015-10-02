<?

$config["js_apps"]["core.apps.layout_search_results"] = array(

    'general' => array(
        'title' => 'Layout search results',
        'name' => 'layout_search_results',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => '',
        'depends' => [
            'site_search'
        ]
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("layout_search_results.js"),
            "styles" => array("styles.css")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("layout_search_results.js"),
            "styles" => array("styles.css")
        ),


        USERTYPE_GUEST => array(
            "code" => array("layout_search_results.js"),
            "styles" => array("styles.css")
        )
    )

)


?>