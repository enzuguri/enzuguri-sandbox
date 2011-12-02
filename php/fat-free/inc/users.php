<?php

$user=new Axon('user');
$data = array_map(function($item){ return $item->cast(); }, $user->find());

header('Content-Type: application/json;');
echo json_encode($data, 0); 

?>