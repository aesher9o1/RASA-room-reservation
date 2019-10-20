<?php

require('./config.php');
    
    $users =  file_get_contents('php://input');
    $array_success = array();
    $array_failure = array();
    $status = true;

    foreach(json_decode($users) as $user){
        $query = "SELECT employee_ID FROM bcone_PROD WHERE email='$user'";
        $results = mysqli_query($link, $query); 
        $row = mysqli_fetch_row($results);

        if($row[0]==null){
            $status = false;
            $array_failure[] = $user;
        }
        else
            $array_success[$user] = $row[0];
    }
    
    echo $status ? json_response($array_success,200) : json_response($array_failure,401);
    
?>