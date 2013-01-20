# Drag and Drop Upload Plugin for osTicket v1.6

The Drag and Drop upload plugin for osTicket v1.6 will work in all modern broswers with HTML5 compatability.

## File & Folders

 - /css 	-	Stylesheet files
 - /js  	-	Javascript files and libraries
 - uploader.php -	Template file to load scripts

## Requirements

	- Jquery Library (version 1.7+)
	- HTML5

## How to use
	
### Config
	
All Fields required.
	
	support : "image/jpg,image/png,image/bmp,image/jpeg,image/gif",		// Valid file formats
	form: "demoFiler",					// Form ID
	dragArea: "dragAndDropFiles",		// Upload Area ID
	uploadUrl: "upload.php"				// Server side file url
	
### Init

 1. Copy the dragdropuploader into the root directory of osTicket
 2. In the scp/tickets.php file:
        Below this line: require_once(INCLUDE_DIR.'class.banlist.php');
        Add this line: require_once(ROOT_PATH.'/dragdropuploader/uploader.php');
 3. Drag and drop some files!	



	