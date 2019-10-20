<?php
    define('DB_SERVER', 'localhost');
    define('DB_USERNAME', 'root');
    define('DB_PASSWORD', '');
    define('DB_NAME', 'bristlecone');
    $link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
    if ($link === false) {
        die("ERROR: Could not connect. " . mysqli_connect_error());
    }



    function json_response($message = null, $code = 200)
    {
        header_remove();
        http_response_code($code);
        header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
        header('Content-Type: application/json');
        $status = array(
            200 => '200 OK',    
            400 => '400 Bad Request',
            422 => 'Unprocessable Entity',
            401 => 'Unauthorized',
            500 => '500 Internal Server Error'
            );
        header('Status: '.$status[$code]);
        return json_encode(array(
            'status' => $code , 
            'message' => $message,
            ));
    }
?>