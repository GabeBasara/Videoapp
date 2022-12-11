//The URIs of the REST endpoint
Webapp = "https://blue-bush-0c6e86903.2.azurestaticapps.net";
IUPS = "https://prod-39.northeurope.logic.azure.com:443/workflows/ad4f7061f7694f2798a233d8487e057f/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tT6ycfi5E9nyzwqmUJsUNCRcjuVSBsR6_m2bRnYcPLk";
RAI = "https://prod-61.northeurope.logic.azure.com:443/workflows/63e90ee08886473688515f10b3a61cc1/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=u5XlqgEjbUrjqqM1-mAZt2YF-dUM2SMq1aHGAN7614c";

BLOB_ACCOUNT = "https://blobstoragecom682gjb.blob.core.windows.net",

DEL0 = "https://prod-30.centralus.logic.azure.com/workflows/029997e4bfe04951bed7ed399734efe7/triggers/manual/paths/invoke/rest/v1/Video/"
DEL1 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=yBNM7iVsFwrrE4GUk-iBeP-4e8gVO-mUROPFbylF4yw"

//Handlers for button clicks
$(document).ready(function() {

 
  $("#retImages").click(function(){

      //Run the get asset list function
      getImages();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){

  //Create a form data object
submitData = new FormData();
//Get form variables and append them to the form data object
submitData.append('FileName', $('#FileName').val());
submitData.append('userID', $('#userID').val());
submitData.append('userName', $('#userName').val());
submitData.append('File', $("#UpFile")[0].files[0]);

//Post the form data to the endpoint, note the need to set the content type header
 $.ajax({
  url: IUPS,
  data: submitData,
  cache: false,
  enctype: 'multipart/form-data',
  contentType: false,
  processData: false,
  type: 'POST',
  success: function(data){

    }
 });

}
 
//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){

  //Replace the current HTML in that div with a loading message
   $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
   $.getJSON(RAI, function( data ) {
   //Create an array to hold all the retrieved assets
   var items = [];
  
   //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
   $.each( data, function( key, val ) {
   items.push( "<hr />");
   items.push("<video controls> <source type='video/mp4' src='"+BLOB_ACCOUNT + val["filePath"] +"' width='400'/> <br />></video>")
   items.push( "File : " + val["fileName"] + "<br />");
   items.push( "Uploaded by: " + val["userName"] + " (user id: "+val["userID"]+")<br />");
   items.push( "<hr />");
   items.push( '<button type="button" id="delete" class="btndeletevideo" onclick="deleteID(\''+val["id"] +'\')">Delete</button> <br/><br/>');
   items.push( '<textarea id="review" class="form-control" style="resize:none; height:100px;"></textarea> <br/>');
   items.push(' <centre><button class="btnreviewsubmit" onclick="submitReview()">Review</button></centre>');
   });
   //Clear the assetlist div
   $('#ImageList').empty();
   //Append the contents of the items array to the ImageList Div
   $( "<ul/>", {
   "class": "my-new-list",
   html: items.join( "" )
   }).appendTo( "#ImageList" );
   });
  }

  function submitReview(){
    var user=document.getElementById('user').value;
    var review=document.getElementById('review').value;
    if(rate != 0 && user !="" && review !=""){
      var html=
      "<h4>User: <label class='text-primary'>" + user + "</label></h4>"
      +"<h4>Rating: <label class='text-primary'>" + rate + "</label></h4>"
      +"<h4>Review</h4>"
      +"<p>"+review+"</p>"
      +"<hr style='border-top:1px solid #000;'/>";
      document.getElementById('result').innerHTML+=html;
   
      document.getElementById('user').value="";
      document.getElementById('review').value="";
    }
  }

function deleteID (id){
  $.ajax({
    type: "DELETE",
    url: DEL0 + id + DEL1
  }).done(function( msg) {
    getImages();
  })
}
