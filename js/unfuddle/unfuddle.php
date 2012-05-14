<?PHP

$output = shell_exec('curl -i -u alexfell:P2Psqr -X GET  "https://analogfolk.unfuddle.com/api/v1/projects.json"');


$trimmed = substr($output, strpos($output, "Status: 200")+13);

header("Content-type: application/json");

echo "$trimmed";

//echo $output;

/*
// XML in PHP is simple to use with SimpleXML, go figure!
$xml = new SimpleXMLElement($output);

foreach ($xml->project as $project) {
  echo '(ID: ' . $project->{'id'} . ') - ' . $project->{'title'};
  echo '-------------------------------------------------------';
  echo $project->{'description'};
  echo '-------------------------------------------------------';
  echo 'Repos: ' . $project->{'repo-name'};
  echo 'Created: ' . $project->{'created-at'};
  echo 'Last mod: ' . $project->{'updated-at'};
  echo '-------------------------------------------------------';
}
*/
?>