<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserImplictsData;

class RecommenderCoreController extends Controller
{
    function __construct()
    {
       
    }
    public function getAPI(Request $req) {
        // dd($req->getClientIp());
    }
    public function postAPI() {

    }
    public function postUserPageTime(Request $req) {
        // $header = $req->header();
        $user_agent = $req->header('user-agent');
       
        $anonymouse = false;
        $is_play_video = false;
      
        if (!$req->user_id) {
            $req->user_id = 0;
            $anonymouse = true;
        }
        if (!$req->play_video) {
            $is_play_video = false;
        } else {
            $is_play_video = true;
        }
        $time = $req->time / 1000;
        $user_id = $req->user_id;
        $id_mon_an = $req->id_mon_an;
        $ten_mon = $req->ten_mon_an;
        $ip = $req->ip();
        $referer = $req->referer;
        $mon_an_id_referrer = $req->mon_an_id_referrer;
        

        $results = [];
        array_push($results, $time, $id_mon_an, $mon_an_id_referrer, $ten_mon, $user_id, $ip,  $user_agent, $referer, $is_play_video);

        $user_data_saved = new UserImplictsData();

        $user_data_saved->user_id = $user_id;
        $user_data_saved->mon_an_id = $id_mon_an;
        $user_data_saved->mon_an_id_referrer = $mon_an_id_referrer;
        $user_data_saved->visited_time = $time;
        $user_data_saved->play_video = $is_play_video;
        $user_data_saved->anonymouse  = $anonymouse;
        $user_data_saved->ip_address = $req->ip();
   
        
        $user_data_saved->save();

        return response()->json($results);
    }
}
