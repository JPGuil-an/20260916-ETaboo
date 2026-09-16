<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <?php
        // Redirect to a certain address
        header("Location: http://localhost:3000/");
        exit; // Ensure no further code is executed after the redirect
        ?>
    </head>

</html>
