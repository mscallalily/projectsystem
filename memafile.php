<?php
    $counter = 10;
    for ($i = 0; $i <= $counter; $i++) {
        if ($i == 5) {
            echo $i."This is five";
        } else if ($i == 10) {
            echo $i."This is ten";
        } else {
            echo $i. "";
        }
    }