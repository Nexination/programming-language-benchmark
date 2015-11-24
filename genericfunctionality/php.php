<?php
/*$mysql =[
    "user" => "nn"
    , "db" => "nn"
    , "pwd" => "DOwixe15HE3e"
    , "host" => "localhost"
    , "charset" => "utf8"
];*/
class controller {
    private $testCount = 100000;
    public function takeTime($action) {
            $startTime = microtime(true);
            $this->$action();
            $endTime = microtime(true);
            echo round($endTime - $startTime, 4) . 's to do ' . $action . PHP_EOL;
    }
    public function arrayTest() {
        $list = [];
        for($i = 0; $i < $this->testCount; $i += 1) {
            $list[$i] = 'test' . $i;
        };
    }
    public function objectTest() {
        $list = [];
        for($i = 0; $i < $this->testCount; $i += 1) {
            $list['test' . $i] = 'test' . $i;
        };
    }
    public function mathTest() {
        $numbera = 1;
        $numberb = 1;
        $numberc = 1;
        $numberd = 1;
        for($i = 1; $i <= $this->testCount; $i += 1) {
            $numbera += $i;
            $numberb -= $i;
            $numberc = $numberc * $i;
            $numberd = $numberc / $i;
        };
    }
    public function sqlTest() {
        $dbh = new PDO('mysql:host=localhost;dbname=playground', 'nn', 'DOwixe15HE3e', array(
            PDO::ATTR_PERSISTENT => true
        ));
        $sql = "INSERT INTO tester (text) VALUES (:text)";
        $q = $dbh->prepare($sql);
        $this->testCount = 1000;
        for($i = 1; $i <= $this->testCount; $i += 1) {
            $text = 't' . $i;
            $q->execute([":text"=>$text]);
        };
    }
    public function nosqlTest() {
        // Configuration
        $dbhost = 'localhost';
        $dbname = 'test';

        // Connect to test database
        $m = new Mongo("mongodb://$dbhost");
        $db = $m->$dbname;

        // Get the users collection
        $c_users = $db->users;

        $this->testCount = 1000;
        for($i = 1; $i <= $this->testCount; $i += 1) {
            // Insert this new document into the users collection
            $user = [
                'derp' => 'merp'
                ,'schmerp' => $i
            ];
            $c_users->save($user);
        };
    }
};
echo '#####PHP5 test#####' . PHP_EOL;
$ctr = new controller();
$ctr->takeTime('arrayTest');
$ctr->takeTime('objectTest');
$ctr->takeTime('mathTest');
$ctr->takeTime('sqlTest');
$ctr->takeTime('nosqlTest');
echo memory_get_peak_usage(true) / 1024 / 1024 . 'MB RAM used' . PHP_EOL;
//echo 'CPU load last minute: ' . sys_getloadavg()[0] . '%' . PHP_EOL;