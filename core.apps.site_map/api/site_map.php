<?

class api_site_map
{


    // $args: {  version_id: int }
    function get($args)
    {
        $this->site_pointer = $args;

        $this->initEcomBrands();
        $this->initEcomCategories();
        $this->initPages();


        $this->dialog->useAppAPI("menu/site_menu");
        $menu_tree = $this->dialog->site_menu->get($this->site_pointer);
        $menu_tree = $menu_tree["data_php"];

        $this->data = array();
        $this->processMenuNode($menu_tree);

        return $this->data;
    }


    function initPages()
    {
        $this->dialog->useAPI("site_page");
        $this->pages = $this->dialog->site_page->getSitePagesByState($this->site_pointer, "active", true);
    }


    function initEcomBrands()
    {
        $this->dialog->useAppAPI("ecommerce_brands_menu/ecommerce_brands");
        $list = $this->dialog->ecommerce_brands->getList();

        $this->urls2ecom_brands = array();
        foreach ($list as $brand) {
            $url = $brand["page_url"];
            if (!$url) continue;

            if (!$this->urls2ecom_brands[$url]) {
                $this->urls2ecom_brands[$url] = array();
            }

            $this->urls2ecom_brands[$url][] = array(
                "id" => $brand["id"],
                "title" => $brand["title"],
                "alias" => $brand["alias"],
                "last_modified" => $brand["last_modified"]
            );
        }
    }


    function initEcomCategories()
    {
        $this->dialog->useAppAPI("ecommerce_category/ecommerce_categories");
        $list = $this->dialog->ecommerce_categories->getTree($this->site_pointer);

        $this->urls2ecom_categories = array();
        foreach ($list as $category) {
            $url = $category["page_url"];
            if (!$url) continue;

            if (!$this->urls2ecom_categories[$url]) {
                $this->urls2ecom_categories[$url] = array();
            }

            $this->urls2ecom_categories[$url][] = array(
                "id" => $category["id"],
                "title" => $category["title"],
                "alias" => $category["alias"],
                "last_modified" => $category["last_modified"]
            );
        }
    }


    function processMenuNode(&$menu_node, $level = 0)
    {
        for ($i = 0; $i < count($menu_node); $i++) {
            $item = $menu_node[$i];

            if ($item["type"] != "std" && $item["type"] != "doc") continue;
            $url = $item["url"];

            $fl = true;

            if ($this->urls2ecom_brands[$url]) {
                foreach ($this->urls2ecom_brands[$url] as $brand) {
                    $this->data[] = array(
                        "title" => $brand["title"],
                        "url" => "/brands/".$brand["alias"].".html",
                        "last_modified" => $brand["last_modified"],
                        "level" => $level
                    );

                    // add brand products
                    $p = array(
                        "id" => $brand["id"]
                    );
                    $products = $this->dialog->ecommerce_brands->getProducts($p);
                    foreach ($products as $product) {
                        if((isset($product['hidden']) && $product['hidden']) || !isset($product["name"]) || !isset($product['page_url']) || !isset($product['last_modified'])){
                                continue;
                            }
                        if ($product["page_url"]) {
                            $this->data[] = array(
                                "title" => $product["name"],
                                "url" => "/products/".$product["alias"].".html",
                                "last_modified" => $product["last_modified"],
                                "level" => $level
                            );
                        }
                    }
                }
                $fl = false;
            }


            if ($this->urls2ecom_categories[$url]) {
                foreach ($this->urls2ecom_categories[$url] as $category) {
                    $this->data[] = array(
                        "title" => $category["title"],
                        "url" => "/categories/".$category["alias"].".html",
                        "last_modified" => $category["last_modified"],
                        "level" => $level
                    );


                    // add category products
                    $p = array(
                        "category_id" => $category["id"]
                    );
                    $products = $this->dialog->ecommerce_categories->getProducts($p);
                    foreach ($products as $product) {
                        if((isset($product['hidden']) && $product['hidden']) || !isset($product["name"]) || !isset($product['page_url']) || !isset($product['last_modified'])){
                                continue;
                        }
                        if ($product["page_url"]) {
                            $this->data[] = array(
                                "title" => $product["name"],
                                "url" => "/products/".$product["alias"].".html",
                                "last_modified" => $product["last_modified"],
                                "level" => $level
                            );
                        }
                    }
                }
                }
                $fl = false;
            }


            if ($fl && $this->pages[$url]) {
                $this->data[] = array(
                    "title" => $item["title"],
                    "url" => $url . ".html",
                    "last_modified" => $this->pages[$url]["last_modified"],
                    "level" => $level
                );
            }

            if (count($item["childs"])) {
                $this->processMenuNode($item["childs"], $level + 1);
            }
        }



}

?>