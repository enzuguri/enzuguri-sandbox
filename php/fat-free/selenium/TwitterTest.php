<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


require_once 'PHPUnit/Extensions/SeleniumTestCase.php';

/**
 * Description of TwitterTest
 *
 * @author alex
 */
class TwitterTest extends PHPUnit_Extensions_SeleniumTestCase {

    function setUp() {
        $this->setBrowser("*firefox");
        $this->setBrowserUrl("http://localhost:8888/Code");
    }

    function testMyTestCase() {
        $this->open("/");
    }

}

?>