# Open local server: 
1. cd /filament-kstn
2. python3 -m http.server
3. open web browser type: `localhost:8000` then choose `suzanne.html` to view the result

# Change object: 
1. Download a object on `Free 3d model` - tail is `.obj`
2. Add obj file to folder object.
3. Open terminal cd to that folder.
4. Open file `code.txt` to see code, replace name of object file with the one you downloaded
5. Copy file `suzanne.filamesh` to `/filament-ksnt` folder (replace old file).

# Change skybox:
1. Cd to hdr folder
2. Open `code.txt` to see the code
3. Change the name of hdr file that you want same as "Changing object".

# Change cammera view:
1. Open `suzanne.js`
2. Change index `eye` to change the position of camera, change index up to change the way camera see the object
3. Changing setProjectCammeraFov(45,aspect,0.1,100,fov) also change the capture of camera toward the object  
