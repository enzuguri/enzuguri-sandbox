<?php

require __DIR__.'/lib/base.php';

F3::set("DB", new DB(
		'mysql:host=localhost;port=8889;dbname=fatfree',
		'root',
		'root'
	));
F3::set('CACHE',FALSE);
F3::set('DEBUG',-1);
F3::set('UI','ui/');
F3::set('IMPORTS','inc/');
F3::set('AUTOLOAD','autoload/');

F3::route('GET /',
	function() {
		F3::set('modules',
			array(
				'apc'=>
					'Cache engine',
				'gd'=>
					'Graphics plugin',
				'hash'=>
					'Framework core',
				'imap'=>
					'Authentication',
				'json'=>
					'Various plugins',
				'ldap'=>
					'Authentication',
				'memcache'=>
					'Cache engine',
				'mongo'=>
					'M2 MongoDB mapper',
				'pcre'=>
					'Framework core',
				'pdo_mssql'=>
					'SQL handler, Axon ORM, Authentication',
				'pdo_mysql'=>
					'SQL handler, Axon ORM, Authentication',
				'pdo_pgsql'=>
					'SQL handler, Axon ORM, Authentication',
				'pdo_sqlite'=>
					'SQL handler, Axon ORM, Authentication',
				'session'=>
					'Framework core',
				'sockets'=>
					'Network plugin',
				'xcache'=>
					'Cache engine'
			)
		);
		echo Template::serve('welcome.htm');
	}
);
//F3::route('GET /users','users.php');
f3::map("/users", "User");
f3::map("/mail", "Mail");
f3::route("GET /require", function(){
    
    
    echo Template::serve("header.html");
    
    
});

F3::run();

?>
