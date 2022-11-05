<!DOCTYPE html>
<html>
    <head>
        <title>Status</title>
    </head>
    <body>
        <div class="container">
            <?php
                $output = shell_exec('python3 /var/www/html/cgipy/wb1.py');
                echo "<pre>$output</pre>";
            ?>
        </div>
        <style>
        .container {
            width: 10%;
            margin: 1 auto;
        }
        </style>
    </body>
</html>
