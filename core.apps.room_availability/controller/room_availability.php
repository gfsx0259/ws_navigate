<?php

class dialog_controller_room_availability extends dialog_controller
{

    function run()
    {
        global $config;

        parent::run();
//readfile("test_data/get_rooms_availability.json");die();

        $motel_id = $_REQUEST["motel_id"];
        $args = urldecode($_REQUEST["args"]);
//2029
        switch ($_REQUEST["act"]) {
            case "get_rooms_availability":
                $url =
                    "http://budgetmotelchain.com.au/websemble/interface.php?target_id=" . $motel_id .
                    "&module=roomavailability&ext_data=1&" . $args;


                if (ini_get(allow_url_fopen)) {
                    $res = file_get_contents($url);
                } else {
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($ch, CURLOPT_URL, $url);
                    $res = curl_exec($ch);
                    curl_close($ch);
                }

                break;
        }
        die($res);
    }

}