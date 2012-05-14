<?php

	//echo REQUEST["token"];
	
	echo "fuck off";


	$token = $_REQUEST["token"];


?>


<html>
<head>

	<script type="text/javascript">
		var token = "<?= $token ?>";
		window.opener.lastfm.processToken(token);
	</script>
</head>
<body>

</body>
</html>