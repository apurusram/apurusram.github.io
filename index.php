<?php

if(isset($_POST['submit'])) {
    
        
$username = $_POST['username'];
$password = $_POST['password'];
    
    if ($username == "xynn" && $password == 147852){
        
        include 'main.html';
        exit();
        
    } else {
        
        echo '<script type="text/javascript">';
        echo ' alert("Access denied!")';
        echo '</script>';
    }
    
    
}

?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

   <script>
    
    function empty() {
        
        var u;
        u = document.forms["test"]["username"].value;
        if (u == "" || u == null)
            {
            
                alert("The username cannot be blank!"); 
                return false;
            }   
        
       var p;
        p = document.forms["test"]["password"].value;
        if (p == "" || p == null) 
            {
            
                alert("The password cannot be blank!"); 
                return false; //we use this to cancel the submit and to call the above function we need to use return before the function
            }   
        
    }    
    
    </script>


</head>
<body>
    
<div class="container">
    
    
    <div class="col-xs-6">
        <form action="index.php" method="post" name="test" onSubmit="return empty()">
            <div class="form-group">
               <label for="username">Username</label>
                <input type="text" name="username" class="form-control">               
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>            
                <input type="password" name="password" class="form-control">              
            </div>
            
            <input class="btn btn-primary" type="submit" name="submit" value="Submit">           
        </form>
        
    </div>         
    
</div>
    

</body>
</html>