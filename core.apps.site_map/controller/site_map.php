<?php

class dialog_controller_site_map extends dialog_controller
{
    public $templateDir = 'js_apps/core.apps.site_map/templates';

    public $appAPIs = [
        'site_map'
    ];

    var $js_layout_app = "layout_sitemap";

    function run()
    {
        require_once("system/templater/Flexy.php");
        require_once("system/templater/Flexy/Element.php");
        $this->templater = HTML_Template_Flexy::getInstance(array('templateDir'=>$this->templateDir));

        parent::run();

        $this->page_data["title"] = "Sitemap";
        $p = array(
            "version_id" => $this->site_version["id"]
        );

        $this->list = $this->site_map->get($p);

        switch ($_REQUEST["ext"]) {
            case "xml":
                header('Content-Type: text/xml');
                for ($i = 0; $i < count($this->list); $i++) {
                    $this->list[$i]["last_modified"] = date("Y-m-d", $this->list[$i]["last_modified"]);
                }
                $this->display('sitemap.xml.tpl');
                break;

            case "txt":
                $this->display("sitemap.tpl");
                break;

            default:
                $this->display("sitemap.tpl");
                break;
        }
    }

    function display($tpl){
        $this->templater->compile($tpl);
        $res = $this->templater->bufferedOutputObject($this, []);
        die($res);
    }


}