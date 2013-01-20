
/*************************************************************************
    uploader.js
 
    Mark D Rushton <mark@rushtonmd.com>
    Copyright (c)  2013

    Released under the GNU General Public License WITHOUT ANY WARRANTY.

**********************************************************************/

// Create a global namespace for settings
var DragDropLib = {};

// Document Ready - Setup All The Things!
$(function() {
    
   DragDropLib.setConfigurationSettings();

   // At this point, check to see if the container we made exists.
   // If it doesn't, something we'd wrong and we need to bail 
   if(!DragDropLib.initializeDiv() || !DragDropLib.setupListeners()) return false;
   
   // The div exists!!
   
   // At this point, everything looks good and you're ready to upload!
   
   return true;
   
});
 
DragDropLib.setConfigurationSettings =  function(){

   // jQuery creates it's own event object, and it doesn't have a
   // dataTransfer property yet. This adds dataTransfer to the event object.
    jQuery.event.props.push('dataTransfer');
   
    // All the configuration settings for the library

   DragDropLib.divContainerName = 'dragDropArea';
   DragDropLib.divContainerID = '#' + DragDropLib.divContainerName; // This just helps make jquery calls a little cleaner
   DragDropLib.divContainerTextID = DragDropLib.divContainerID + ' H1';
   DragDropLib.query_id = DragDropLib.getQueryParam('id');
   DragDropLib.uploadUrl = $('#replyform').attr('action');
   DragDropLib.ticket_id = $("input:hidden[name=ticket_id]").val();
   DragDropLib.replaceUrl = DragDropLib.uploadUrl.split('#')[0];
   DragDropLib.msg_id = $("input:hidden[name=msg_id]").val();

   // These are used for the dynamic tracking of file uploads
   DragDropLib.totalFilesDropped = 0;
   DragDropLib.totalFilesUploaded = 0;
   DragDropLib.filesDropped = [];
};

DragDropLib.initializeDiv = function(){

   // Find the div that has the attachments upload input, and insert a div for our drag-drop box
   $('#attachment').parent().before('<div id="'+ DragDropLib.divContainerName + '" class="uploadArea"></div>');
   
   $(DragDropLib.divContainerID).append('<h1>Drop files here...</h1> <div id="loadingBar"><div id="loadingProgressG" style="margin-left: auto; margin-right: auto; margin-top: 60px;"><div id="loadingProgressG_1" class="loadingProgressG"></div></div></div>');

   // This function returns false if the div wasn't created properly
   return ($(DragDropLib.divContainerID).length); 
};

DragDropLib.setupListeners = function(){
    if (window.File && window.FileReader && window.FileList && window.Blob) {	
             $(DragDropLib.divContainerID).bind('dragover', DragDropLib.dragOverEvent);
             $(DragDropLib.divContainerID).bind('dragleave', DragDropLib.dragLeaveEvent);
             $(DragDropLib.divContainerID).bind('drop', DragDropLib.dropEvent);
             return true;
    } else
            return false;
};
  
DragDropLib.dragOverEvent = function(e){
    e.stopPropagation(); 
    e.preventDefault(); 
    $(DragDropLib.divContainerID).addClass('hover');
    
};

DragDropLib.dragLeaveEvent = function(e){
    $(DragDropLib.divContainerID).removeClass('hover');
};

DragDropLib.dropEvent = function(e){
    
    // Stop any default behaviors
    e.stopPropagation(); 
    e.preventDefault();

    $(DragDropLib.divContainerID).removeClass('hover');

    DragDropLib.filesDropped = e.dataTransfer.files;
    DragDropLib.totalFilesDropped = e.dataTransfer.files.length;
    DragDropLib.totalFilesUploaded = 0;

    $(DragDropLib.divContainerTextID).text('0'+' of '+ DragDropLib.totalFilesDropped +' uploaded.');
    
    $('#loadingBar').show();

    for (var i = 0; i < DragDropLib.totalFilesDropped; i++) {
        
        var data = new FormData();

            data.append('ticket_id', DragDropLib.ticket_id);
            data.append('msg_id', DragDropLib.msg_id);
            data.append('a', 'reply');
            data.append('response', ' ' + $('#response').val()); // There has to be a response, even if it's a space character
            data.append('attachment',DragDropLib.filesDropped[i]);
            
            $.ajax({
                    type:"POST",
                    url:DragDropLib.uploadUrl,
                    data:data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success:function(rponse){

                            DragDropLib.totalFilesUploaded++;
                            if(DragDropLib.totalFilesUploaded < DragDropLib.totalFilesDropped)
                            $(DragDropLib.divContainerTextID).text(DragDropLib.totalFilesUploaded + ' of '+ DragDropLib.totalFilesDropped +' uploaded.');
                            else{
                                $('#loadingBar').hide();
                                $(DragDropLib.divContainerTextID).text('Reloading!');
                                window.location = DragDropLib.replaceUrl;
                            }
                    },
                    error:function(rponse){
                        alert("There was a problem with your upload!");
                        location.reload();
                    }
            });
      }
  
};

DragDropLib.getQueryParam = function(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
};

 