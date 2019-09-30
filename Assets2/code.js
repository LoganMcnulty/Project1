document.addEventListener('DOMContentLoaded', function () {


// Allows for icons to be clicked on and open up bios.

document.getElementById("button1").addEventListener("click",
 function(){
  document.querySelector('.bg-modal1').style.display = 'flex';
});

document.getElementById("button2").addEventListener("click", 
function(){
  document.querySelector('.bg-modal2').style.display = 'flex';
});

document.getElementById("button3").addEventListener("click", 
function(){
  document.querySelector('.bg-modal3').style.display = 'flex';

});

 document.getElementById("button4").addEventListener("click", 
 function(){
 document.querySelector('.bg-modal4').style.display = 'flex';

 });

 // Allows for bios to be closed. 

document.querySelector('.close').addEventListener('click', 
function() {
    document.querySelector('.bg-modal1').style.display = 'none';
});

document.querySelector('.close2').addEventListener('click', 
function() {
    document.querySelector('.bg-modal2').style.display = 'none';
});

document.querySelector('.close3').addEventListener('click', 
function() {
    document.querySelector('.bg-modal3').style.display = 'none';
});

document.querySelector('.close4').addEventListener('click', 
function() {
    document.querySelector('.bg-modal4').style.display = 'none';

});
});
