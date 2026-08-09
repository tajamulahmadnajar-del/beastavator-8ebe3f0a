# Telegram Connect Hub

Ya sme to same page bana do with same pixel and @connector:telegram:"Telegram" Chennal 



<!DOCTYPE html>

<html lang="en">



<head>



<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">



<title>AVIATOR KING ™</title>



<!-- Meta Pixel Code -->

<script>

!function(f,b,e,v,n,t,s)

{if(f.fbq)return;n=f.fbq=function(){n.callMethod?

n.callMethod.apply(n,arguments):n.queue.push(arguments)};

if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';

n.queue=[];t=b.createElement(e);t.async=!0;

t.src=v;s=b.getElementsByTagName(e)[0];

s.parentNode.insertBefore(t,s)}(window, document,'script',

'https://connect.facebook.net/en_US/fbevents.js');



fbq('init', '1063547539604154');

fbq('track', 'PageView');

</script>



<noscript>

<img height="1" width="1" style="display:none"

src="https://www.facebook.com/tr?id=1063547539604154&ev=PageView&noscript=1"/>

</noscript>

<!-- End Meta Pixel Code -->



<!-- Fonts -->

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">



<!-- Font Awesome -->

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">



<style>



*{

    margin:0;

    padding:0;

    box-sizing:border-box;

    font-family:'Poppins', sans-serif;

}



body{

    background:#120303;

    color:#fff;

    min-height:100vh;

    display:flex;

    justify-content:center;

    align-items:center;

    padding:20px;

}



.container{

    width:100%;

    max-width:400px;

    text-align:center;

}



h1{

    color:#f5fe6c;

    font-size:24px;

    line-height:1.4;

    margin-bottom:20px;

}



.profile-img{

    width:180px;

    height:180px;

    border-radius:50%;

    object-fit:cover;

    border:3px solid rgba(240,152,152,0.5);

    margin-bottom:20px;

    max-width:100%;

    cursor:pointer;

}



.sub-text{

    color:#d9d5d5;

    font-size:15px;

    margin-bottom:8px;

}



.join-text{

    color:#ffffff;

    font-size:15px;

    font-weight:600;

    margin-bottom:20px;

}



.btn{

    display:flex;

    align-items:center;

    justify-content:center;

    gap:8px;

    width:100%;

    padding:14px;

    background:#0174c7;

    color:#fff;

    font-size:18px;

    font-weight:600;

    border-radius:12px;

    text-decoration:none;

    box-shadow:0 4px 10px rgba(0,0,0,0.5);

    transition:0.3s;

    cursor:pointer;

}



.btn:hover{

    background:#025fa3;

    transform:scale(1.03);

}



.btn i{

    font-size:18px;

}



@media(max-width:480px){



    h1{

        font-size:21px;

    }



    .profile-img{

        width:160px;

        height:160px;

    }



    .btn{

        font-size:16px;

        padding:13px;

    }



}



</style>



</head>



<body>



<div class="container">



    <h1>INDIA's MOST DEMANDING CHANNEL</h1>



    <!-- Image no longer has its own <a> href, so click always goes through JS handler -->

    <img

    src="https://d1yei2z3i6k35z.cloudfront.net/16218780/697d038dcd182_photo_2025-10-1510.05.14.jpeg"

    class="profile-img"

    alt="AVIATOR KING™"

    id="joinImg">



    <p class="sub-text">10K+ MEMBERS ALREADY JOINED</p>



    <p class="join-text">DON'T WAIT, JOIN NOW</p>



    <a href="#" class="btn" id="joinBtn">

        <i class="fab fa-telegram"></i>

        JOIN NOW

    </a>



</div>



<script>



const TELEGRAM_LINK = "https://t.me/+Oaihgt0GAvgxMTA1";



let joinClicked = false;



// Shared handler so BOTH the image and the button fire the pixel event

function handleJoinClick(e){



    e.preventDefault();



    if (!joinClicked) {

        joinClicked = true;

        // Meta Subscribe Event — fires only once even if user clicks both elements

        fbq('track', 'Subscribe');

    }



    setTimeout(function(){

        window.location.href = TELEGRAM_LINK;

    }, 500);

}



document.getElementById("joinBtn").addEventListener("click", handleJoinClick);

document.getElementById("joinImg").addEventListener("click", handleJoinClick);



</script>



</body>

</html>

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://beastavator.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/93070cbb-c158-4b2e-96a9-ce941c861c33).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
