<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


class Mail
{

    public $inbox = "";
    public $hostname = "";
    public $username = "";
    public $password = "";
    
    public function __construct() {
        
        /* connect to gmail */
        $this->hostname = '{imap.gmail.com:993/imap/ssl/novalidate-cert}INBOX';
        $this->username = 'carrymass@gmail.com';
        $this->password = '12monkeys';
    }
    
    
    function get(){
        
        
        $this->connect();
        
        
        /* grab emails */
        $emails = imap_search($this->inbox,'FROM "Twitter"');
        
        
        
        /* if emails are returned, cycle through each... */
        if($emails) {

                /* begin output var */
                $output = '';

                /* put the newest emails on top */
                rsort($emails);

                /* for every email... */
                foreach($emails as $email_number) {

                        /* get information specific to this email */
                        $overview = imap_fetch_overview($inbox,$email_number,0);
                        $message = imap_fetchbody($inbox,$email_number,2);

                        /* output the email header information */
                        $output.= '<div class="toggler '.($overview[0]->seen ? 'read' : 'unread').'">';
                        $output.= '<span class="subject">'.$overview[0]->subject.'</span> ';
                        $output.= '<span class="from">'.$overview[0]->from.'</span>';
                        $output.= '<span class="date">on '.$overview[0]->date.'</span>';
                        $output.= '</div>';

                        /* output the email body */
                        $output.= '<div class="body">'.$message.'</div>';
                }

                echo $output;
        } 
        
        
        $this->disconnect();
        
        
    }
    
    
    function connect()
    {
        $this->inbox = imap_open($this->hostname,$this->username,$this->password) or die('Cannot connect to Gmail: ' . imap_last_error());
    }
    
    function disconnect()
    {
        imap_close($this->inbox);
    }
    
    
    
}





?>
