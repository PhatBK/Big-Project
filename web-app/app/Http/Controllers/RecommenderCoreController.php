<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserImplictsData;

use GuzzleHttp\Client;

class RecommenderCoreController extends Controller
{
    function __construct()
    {
       
    }
    public function getAPI(Request $req) {
        // dd($req->getClientIp());
        $client = new Client([
            // Base URI is used with relative requests
            'base_uri' => 'http://httpbin.org',
            // You can set any number of default request options.
            'timeout'  => 2.0,
        ]);
        dd($client);
    }
    public function postUserPageTime(Request $req) {
        $date_visit = null;
        $time_visit_start = null;
        
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
        array_push($results, $time, $id_mon_an, $mon_an_id_referrer, $ten_mon, $user_id, $ip,  $user_agent, $referer, $is_play_video, $req->date_visit, $req->time_visit_start);

        $user_data_saved = new UserImplictsData();

        $user_data_saved->user_id = $user_id;
        $user_data_saved->mon_an_id = $id_mon_an;
        $user_data_saved->mon_an_id_referrer = $mon_an_id_referrer;
        $user_data_saved->visited_time = $time;
        $user_data_saved->play_video = $is_play_video;
        $user_data_saved->anonymouse  = $anonymouse;
        $user_data_saved->ip_address = $req->ip();
        $user_data_saved->date_visit = $req->date_visit;
        $user_data_saved->time_visit_start = $req->time_visit_start;
   
        
        $user_data_saved->save();

        return response()->json($results);
    }
    public function apiRecommenderShareData() {
        $all_user_data_implicts = UserImplictsData::all();
        
        return response()->json($all_user_data_implicts);
    }
    public function getFlaskApi() {

    }
    public function postFlaskApi() {
        
    }
    public function aprioriRuleAssociation($data) {

    }
}
