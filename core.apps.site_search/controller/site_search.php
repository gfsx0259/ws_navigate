<?php

class dialog_controller_site_search extends dialog_controller
{
    public $widgetName = 'site_search';
    public $appAPIs = ['search'];

    function run()
    {
        parent::run();

        $p = array(
            "q" => trim($_GET["q"]),
            "layout_mode" => $_REQUEST["layout_mode"],
            "version_id" => $this->site_version["id"],
            "hidden" => 0
        );

        if (strlen($p["q"]) < 2) {
//                $this->session_data->delete("site_search_results");
            return array(
                "status" => "error"
            );
        }

        $res = array(
            "status" => "ok",
            "q" => $p["q"],
            "hidden" => 0
        );

        if (!$_GET["target"]) {
            $res["data"] = array(
                "products" => $this->search->getProducts($p),
                "categories" => $this->search->getCategories($p),
                "brands" => $this->search->getBrands($p),
                "pages" => $this->search->getPages($p)
            );
        } else {
            $res["offset"] = (int)$_GET["offset"];
            if (!$res["offset"]) $res["offset"] = 0;
            $res["items_count"] = (int)$_GET["items_count"];
            if (!$res["items_count"]) $res["items_count"] = 20;

            $res["target"] = $_GET["target"];

            switch ($_GET["target"]) {
                case "products":
                    $res["data"] = $this->search->getProducts($p, $res["offset"], $res["items_count"]);
                    break;
                case "categories":
                    $res["data"] = $this->search->getCategories($p, $res["offset"], $res["items_count"]);
                    break;
                case "brands":
                    $res["data"] = $this->search->getBrands($p, $res["offset"], $res["items_count"]);
                    break;
                case "pages":
                    $res["data"] = $this->search->getPages($p, $res["offset"], $res["items_count"]);
                    break;
            }
        }

//            $this->session_data->set("site_search_results", $this->json->encode($res));

        return $res;
    }


}

?>