<?php

class api_search
{

    var $itemsPerPage = 10;

    // $args: {  q:str  }
    function getProducts($args, $offset = 0, $items_count = 10)
    {
        $offset = (int)$offset;
        $items_count = (int)$items_count;


        $this->dialog->useAppAPI("ecommerce/ecommerce");
        $ecom_settings = $this->dialog->ecommerce->generalReadSettings();
        $wsql = "";
        if (!$ecom_settings["skip_check_in_stock"]) {
            $wsql .= " AND ep.qty_stock > 0";
        }

        if (isset($args["hidden"])) {
            $wsql .= " AND ep.hidden = %hidden%";
        }


        $args["code"] = $args["q"];
        $q = explode(" ", $args["q"]);
        $args["q"] = "";
        foreach ($q as $qk) {
            $qk = trim($qk);
            if (strlen($qk) > 1) {
                $args["q"] .= " +" . $qk;
            }
        }


        if (is_numeric($args["code"])) {
            $wsql_code = "OR ep.ext_id = %code%";
        } else {
            $wsql_code = "OR ep.code = %code%";
        }

        $sql = "
                SELECT
                    count(*)
                FROM 
                    ecom_products as ep
                WHERE
                    (MATCH(ep.name, ep.keywords) AGAINST(%q% IN BOOLEAN MODE) " . $wsql_code . ")" . $wsql;
        $res = array(
            "total" => $this->db->get_one($sql, $args),
            "offset" => $offset
        );


        if ($res["total"]) {
            $sql = "
                    SELECT
                        ep.id,
                        ep.name as title,
                        ep.alias,
                        ep.page_url,
                        MATCH(ep.name, ep.keywords) AGAINST(%q% IN BOOLEAN MODE) as idxr
                    FROM 
                        ecom_products as ep
                    WHERE
                        (MATCH(ep.name, ep.keywords) AGAINST(%q% IN BOOLEAN MODE) " . $wsql_code . ")
                    " . $wsql . "
                    ORDER BY
                        ep.priority,
                        ep.name ASC
                    LIMIT " . (int)$offset . ", " . (int)$items_count;

            $res["data"] = $this->db->get_list($sql, $args);
            $this->dialog->useAppAPI("ecommerce/ecom_pages");
            $this->dialog->ecom_pages->addDefaultPageURL($res["data"], "product_default_page_url");
            $this->generateURLs($res["data"], "ecom_product_id",__METHOD__);
        } else {
            $res["data"] = array();
        }

        return $res;
    }


    // $args: { q:str  }
    function getBrands($args, $offset = 0, $items_count = 5)
    {
        $offset = (int)$offset;
        $items_count = (int)$items_count;


        $sql = "
                SELECT
                    count(*)
                FROM 
                    ecom_brands
                WHERE
                    hidden = 0 AND
                    products_count > 0 AND
                    MATCH(title) AGAINST(%q%)";
        $res = array(
            "total" => $this->db->get_one($sql, $args),
            "offset" => $offset
        );


        if ($res["total"]) {
            $sql = "
                    SELECT
                        eb.id,
                        eb.title,
                        eb.alias,
                        eb.page_url,
                        MATCH(eb.title) AGAINST(%q%) as idxr
                    FROM 
                        ecom_brands as eb
                    WHERE   
                        hidden = 0 AND
                        eb.products_count > 0 AND
                        MATCH(eb.title) AGAINST(%q%)
                    ORDER BY
                        idxr DESC
                    LIMIT " . (int)$offset . ", " . (int)$items_count;
            $res["data"] = $this->db->get_list($sql, $args);

            $this->dialog->useAppAPI("ecommerce/ecom_pages");
            $this->dialog->ecom_pages->addDefaultPageURL($res["data"], "brand_default_page_url");
            $this->generateURLs($res["data"], "ecom_brand_id",__METHOD__);
        } else {
            $res["data"] = array();
        }
        return $res;
    }


    // $args: {  q:str  }
    function getCategories($args, $offset = 0, $items_count = 5)
    {
        $offset = (int)$offset;
        $items_count = (int)$items_count;

        $sql = "
                SELECT
                    count(*)
                FROM 
                    ecom_categories
                WHERE
                    hidden = 0 AND
                    products_count > 0 AND
                    MATCH(title, description) AGAINST(%q%)";
        $res = array(
            "total" => $this->db->get_one($sql, $args),
            "offset" => $offset
        );


        if ($res["total"]) {
            $sql = "
                    SELECT
                        ec.id,
                        ec.title,
                        ec.alias,
                        ec.page_url,
                        MATCH(ec.title, ec.description) AGAINST(%q%) as idxr
                    FROM 
                        ecom_categories as ec
                    WHERE   
                        hidden = 0 AND
                        ec.products_count > 0 AND
                        MATCH(ec.title, ec.description) AGAINST(%q%)
                    ORDER BY
                        idxr DESC
                    LIMIT " . (int)$offset . ", " . (int)$items_count;
            $res["data"] = $this->db->get_list($sql, $args);

            $this->dialog->useAppAPI("ecommerce/ecom_pages");
            $this->dialog->ecom_pages->addDefaultPageURL($res["data"], "category_default_page_url");
            $this->generateURLs($res["data"], "ecom_category_id",__METHOD__);
        } else {
            $res["data"] = array();
        }
        return $res;
    }


    // $args: { version_id: int, layout_mode: str, q:str  }
    function getPages($args, $offset = 0, $items_count = 5)
    {
        $this->dialog->useAppAPI('layout_columns/layout_rows');
        $this->dialog->layout_rows->initSearchIndex($args);

        $offset = (int)$offset;
        $items_count = (int)$items_count;

        $sql = "
                SELECT
                    count(*)
                FROM 
                    layout_rows as lr
                LEFT JOIN
                    layout_rows2pages as lr2p
                ON
                    lr2p.row_id = lr.id
                WHERE
                    lr.version_id = %version_id% AND
                    lr2p.owner = 1 AND
                    MATCH(lr." . $args["layout_mode"] . "_search_index) AGAINST(%q%)";
        $res = array(
            "total" => $this->db->get_one($sql, $args),
            "offset" => $offset
        );


        if ($res["total"]) {
            $sql = "
                    SELECT
                        p.id,
                        p.url as page_url,
                        p.title,
                        MATCH(lr." . $args["layout_mode"] . "_search_index) AGAINST(%q%) as idxr
                    FROM 
                        layout_rows as lr
                    LEFT JOIN
                        layout_rows2pages as lr2p
                    ON
                        lr2p.row_id = lr.id
                    LEFT JOIN
                        pages as p
                    ON
                        p.id = lr2p.page_id
                    WHERE
                        lr.version_id = %version_id% AND
                        lr2p.owner = 1 AND
                        p.published = 1 AND
                        p.pwd = '' AND
                        MATCH(lr." . $args["layout_mode"] . "_search_index) AGAINST(%q%)
                    ORDER BY 
                        idxr DESC
                    LIMIT " . (int)$offset . ", " . (int)$items_count;
            $res["data"] = $this->db->get_list($sql, $args);
            $this->generateURLs($res["data"]);
        } else {
            $res["data"] = array();
        }
        return $res;
    }


    function generateURLs(&$list, $param_name = false,$method = false)
    {
        if($method){
                preg_match('/get(.*)/i',(string)$method,$data);
                $method = strtolower($data[1]);
            }
        for ($i = 0; $i < count($list); $i++) {
            if($method){
                    $list[$i]["url"] = '/'.$method.'/'.$list[$i]["alias"].'.html';
                }else{
                    $list[$i]["url"] = $list[$i]["page_url"].".html".($param_name ? "?".$param_name."=".$list[$i]["id"] : "");
                }

            unset($list[$i]["page_url"]);
            unset($list[$i]["idxr"]);
            unset($list[$i]["id"]);
        }
    }

    function formatQuery($q)
    {
        $q = substr($q, 0, 64);
        $q = preg_replace("/[^\w\x7F-\xFF\s]/", " ", $q);
        $q = trim(preg_replace("/\s(\S{1,3})\s/",
            " ",
            ereg_replace(" +", "  ", " $q ")));
        $q = ereg_replace(" +", " ", $q);
        return $q;
    }


// site pages search
    function findInPages($q, $ofs)
    {
        $this->rebuildSearchIndex();

        $offset = (int)$ofs;
        $q = $this->formatQuery($q);

        $sql_args = array("q" => $q);

        $sql_where = "
                WHERE
                    published = 1
                AND
                    pwd = ''
                AND
                    MATCH(search_index) AGAINST(%q%)";

        $sql = "
                SELECT
                    COUNT(*)
                FROM
                    pages " . $sql_where;

        $total = $this->db->get_one($sql, $sql_args);

        $sql = "
                SELECT
                    id,
                    url,
                    title,
                    search_index as s,
                    MATCH(search_index) AGAINST(%q%) as idxr
                FROM
                    pages
                " . $sql_where . "
                ORDER BY
                    idxr DESC
                LIMIT " . $offset . ", " . $this->itemsPerPage;

        $res = $this->db->get_list($sql, $sql_args);

        if (count($res)) {
            $words = str_replace(" ", "|", $q);
            for ($i = 0; $i < count($res); $i++) {
                $res[$i]["s"] = ereg_replace($words, "<strong>\\0</strong>", $res[$i]["s"]);
            }
        }

        return array(
            "ofs" => $offset,
            "total" => $total,
            "per_page" => $this->itemsPerPage,
            "data" => $res
        );
    }


    function rebuildSearchIndex()
    {
        $sql = "
                SELECT
                    id
                FROM
                    pages
                WHERE
                    search_index_ready = 0 AND
                    type = 'std'";

        $pages = $this->db->get_vector($sql);

        if (!count($pages)) return;

        $this->dialog->useAPI("site_texts");

        for ($i = 0; $i < count($pages); $i++) {
            $p = array(
                "page_id" => $pages[$i]
            );
            //build index on texts & body_doc_id
//                $this->buildTextIndex($p);
        }
    }


// forum search
    function findInForum($q, $ofs)
    {
        $offset = (int)$ofs;
        $q = $this->formatQuery($q);
        $sql_args = array("q" => $q);

        $sql_where = "
                WHERE
                (
                    MATCH(ft.title, ft.content) AGAINST(%q%)
                    OR
                    MATCH(fr.title, fr.content) AGAINST(%q%)
                )";

        $sql = "
                SELECT
                    COUNT(*)
                FROM
                    forum_topics as ft
                LEFT JOIN
                    forum_replies as fr
                ON
                    fr.topic_id = ft.id
                " . $sql_where;

        $total = $this->db->get_one($sql, $sql_args);

        $sql = "
                SELECT
                    ft.id,
                    ft.title,
                    MATCH(ft.title, ft.content) AGAINST(%q%) as idxt,
                    MATCH(fr.title, fr.content) AGAINST(%q%) as idxr
                FROM
                    forum_topics as ft
                LEFT JOIN
                    forum_replies as fr
                ON
                    fr.topic_id = ft.id
                " . $sql_where . "
                ORDER BY
                    idxt DESC,
                    idxr DESC
                LIMIT " . $offset . ", " . $this->itemsPerPage;


        $res = $this->db->get_list($sql, $sql_args);


        return array(
            "ofs" => $offset,
            "total" => $total,
            "per_page" => $this->itemsPerPage,
            "data" => $res
        );
    }


}