


// TODO: declare asset URLs
const albedo_suffix = Filament.getSupportedFormatSuffix('astc s3tc');
const texture_suffix = Filament.getSupportedFormatSuffix('etc');

const environ = 'venetian_crossroads_2k'
const ibl_url = `_ibl.ktx`;
const sky_small_url = `_skybox.ktx`;
const sky_large_url = `_skybox.ktx`;
//ultimate
const ao_url = `ao${texture_suffix}.ktx`;

const filamat_url = 'textured.filamat';
const filamat2_url = 'textured2.filamat';
//khai bao url cho obj
const filamesh_url = 'suzanne.filamesh';
const filamesh2_url = 'suzanne2.filamesh';
const filamesh3_url = 'suzanne3.filamesh';
const filamesh4_url = 'suzanne4.filamesh';
const start = Date.now();

//khoi tao
Filament.init([ filamat_url, 
		filamat2_url,
		filamesh_url, 
		filamesh2_url, 
		filamesh3_url, 
		filamesh4_url, 
		sky_small_url, ibl_url ], () => {
    window.app = new App(document.getElementsByTagName('canvas')[0]);
});

class App {
    constructor(canvas) {
        this.canvas = canvas;
        this.engine = Filament.Engine.create(canvas);
        this.scene = this.engine.createScene();
                
	const material  = this.engine.createMaterial(filamat_url);
	const material2 = this.engine.createMaterial(filamat2_url);
	//Khai bao lop material        
	this.matinstance = material.createInstance();
	this.matinstance2 = material.createInstance();
	this.matinstance3 = material.createInstance();
	this.matinstance4 = material2.createInstance();
	//khai bao obj 1
        const filamesh = this.engine.loadFilamesh(filamesh_url, this.matinstance);
        this.suzanne = filamesh.renderable;
        //khai bao obj 2
        const filamesh2 = this.engine.loadFilamesh(filamesh2_url, this.matinstance2);
	this.suzanne2 = filamesh2.renderable;
        //khai bao obj 3
        const filamesh3 = this.engine.loadFilamesh(filamesh3_url, this.matinstance3);
	this.suzanne3 = filamesh3.renderable;
	//obj 4
	const filamesh4 = this.engine.loadFilamesh(filamesh4_url, this.matinstance4);
	this.suzanne4 = filamesh4.renderable;
	// Khai bao mau sac
	const color1 = [0.14, 0.13, 0.13];
	const color2 = [0.24, 0.24, 0.24];
	const color3 = [0.24, 0.24, 0.24];
	this.matinstance.setColor3Parameter('baseColor', Filament.RgbType.sRGB, color1);
	this.matinstance2.setColor3Parameter('baseColor', Filament.RgbType.sRGB, color2);
	this.matinstance3.setColor3Parameter('baseColor', Filament.RgbType.sRGB, color3);

        // TODO: create sky box and IBL
	this.skybox = this.engine.createSkyFromKtx(sky_small_url);
	this.scene.setSkybox(this.skybox);
	this.indirectLight = this.engine.createIblFromKtx(ibl_url);
	this.indirectLight.setIntensity(100000);
	this.scene.setIndirectLight(this.indirectLight);

	// TODO: Fetch asset asychronously // TODO: fetch larger assets
	Filament.fetch([sky_large_url, ao_url], () => {
	const ao = this.engine.createTextureFromKtx(ao_url);

    	const sampler = new Filament.TextureSampler(
        Filament.MinFilter.LINEAR_MIPMAP_LINEAR,
        Filament.MagFilter.LINEAR,
        Filament.WrapMode.CLAMP_TO_EDGE);

   	this.matinstance4.setTextureParameter('ao', ao, sampler);

    	// Replace low-res skybox with high-res skybox.
    	this.engine.destroySkybox(this.skybox);
    	this.skybox = this.engine.createSkyFromKtx(sky_large_url);
    	this.scene.setSkybox(this.skybox); 
	//add vat the
    	this.scene.addEntity(this.suzanne);
   	this.scene.addEntity(this.suzanne2);
	this.scene.addEntity(this.suzanne3);
	this.scene.addEntity(this.suzanne4);
});
        // TODO: initialize gltumble
	this.trackball = new Trackball(canvas, {startSpin: 0});       

        this.swapChain = this.engine.createSwapChain();
        this.renderer = this.engine.createRenderer();
        this.camera = this.engine.createCamera(Filament.EntityManager.get().create());
        this.view = this.engine.createView();
        this.view.setCamera(this.camera);
        this.view.setScene(this.scene);
        this.render = this.render.bind(this);
        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);

        //const eye = [-60, -40, 10], center = [0, 0, 0], up = [0, -4, 12]; dog
	//  const eye = [7, 0, 0], center = [0, 0, 0], up = [0, 1, 0]; panda 
        //this.camera.lookAt(eye, center, up);

        this.resize();
        window.requestAnimationFrame(this.render);
    }

    render() {
	var count = Date.now() - start; 
	//moi s tuong ung 200 dv
	const e1 = [2, 10, 10];
	const e2 = [-2, 2, 0];
	const e3 = [-4, 8, 0];
	const e4 = [-2, -4, 0];
	const time = Date.now()%16000;
	const radians = Date.now() / 5000;
	const center = [0, 0, 0], up = [0, 1, 0];
	var eye;
	var transform, transform2, transform3, transform4;
	var tcm, tcm2, tcm3, tcm4;
	var inst, inst2, inst3, inst4;
	var radrotate = Date.now()%7200;
	var q = quat.fromEuler(quat.create(),0,0,360/7200*radrotate);	
	
	const rad =  Date.now() / 500;
	const a  = (rad%8)<4?rad%8:-8+rad%8;
	const updown = 0;
	var ahead;
	ahead = a *5;
	const v  = ((4+rad)%16)<8?[ 0,updown,ahead    ]:[ 0,updown,ahead    ];
	const v2 = ((4+rad)%16)<8?[-5,updown,ahead - 5]:[-5,updown,ahead - 5];
	const v3 = ((4+rad)%16)<8?[ 5,updown,ahead - 5]:[ 5,updown,ahead - 5];
	var radrotate1;
	if(count < 10000)
	{
		radrotate1 = Date.now() /1000;
                
		transform = mat4.fromRotation(mat4.create(), radrotate1, [0, 0, 1]);
		tcm = this.engine.getTransformManager();
		inst = tcm.getInstance(this.suzanne);
    		tcm.setTransform(inst, transform);

		transform2 = mat4.fromTranslation(mat4.create(), [100,100,100])
		tcm2 = this.engine.getTransformManager();
		inst2 = tcm2.getInstance(this.suzanne2);
		tcm2.setTransform(inst2, transform2);

		transform3 = mat4.fromTranslation(mat4.create(), [100,100,100])
		tcm3 = this.engine.getTransformManager();
		inst3 = tcm3.getInstance(this.suzanne3);
		tcm3.setTransform(inst3, transform3);	

		transform4 = mat4.fromTranslation(mat4.create(), [100,100,100])
		tcm4 = this.engine.getTransformManager();
		inst4 = tcm4.getInstance(this.suzanne4);
		tcm4.setTransform(inst4, transform4);	

		eye = e1;
		this.camera.lookAt(eye, center, up);

	}
	else if(count <20000)
	{
		
		radrotate1 = Date.now() /1000;
                
		transform = mat4.fromRotation(mat4.create(), radrotate1, [0, 0, 1]);
		tcm = this.engine.getTransformManager();
		inst = tcm.getInstance(this.suzanne);
    		tcm.setTransform(inst, transform);

		transform2 = mat4.fromTranslation(mat4.create(), v2)
		tcm2 = this.engine.getTransformManager();
		inst2 = tcm2.getInstance(this.suzanne2);
		tcm2.setTransform(inst2, transform2);

		transform3 = mat4.fromTranslation(mat4.create(), v3)
		tcm3 = this.engine.getTransformManager();
		inst3 = tcm3.getInstance(this.suzanne3);
		tcm3.setTransform(inst3, transform3);	

		transform4 = mat4.fromTranslation(mat4.create(), [100,100,100])
		tcm4 = this.engine.getTransformManager();
		inst4 = tcm4.getInstance(this.suzanne4);
		tcm4.setTransform(inst4, transform4);	
		
		eye = e2;
		vec3.rotateY(eye, eye, center, radians);
		this.camera.lookAt(eye, center, up);

	}
	else if (count > 20000 && count < 45000)
	{	
		
		transform = mat4.fromRotationTranslation(mat4.create(),q, v);
		tcm = this.engine.getTransformManager();
		inst = tcm.getInstance(this.suzanne);
		tcm.setTransform(inst, transform);

		transform2 = mat4.fromTranslation(mat4.create(), v2)
		tcm2 = this.engine.getTransformManager();
		inst2 = tcm2.getInstance(this.suzanne2);
		tcm2.setTransform(inst2, transform2);

		transform3 = mat4.fromTranslation(mat4.create(), v3)
		tcm3 = this.engine.getTransformManager();
		inst3 = tcm3.getInstance(this.suzanne3);
		tcm3.setTransform(inst3, transform3);

		transform4 = mat4.fromTranslation(mat4.create(), [100,100,100])
		tcm4 = this.engine.getTransformManager();
		inst4 = tcm4.getInstance(this.suzanne4);
		tcm4.setTransform(inst4, transform4);		

		eye = (time < 8000)? e3:e4;
		vec3.rotateY(eye, eye, center, radians);
		this.camera.lookAt(eye, center, up);
	}
	else if( count > 45000 && count <60000)
	{	
		this.matinstance.setColor3Parameter('baseColor', Filament.RgbType.sRGB, [0.2,0,0]);
		this.matinstance2.setColor3Parameter('baseColor', Filament.RgbType.sRGB, [0,0,0.2]);
		this.matinstance3.setColor3Parameter('baseColor', Filament.RgbType.sRGB, [0,0,0.2]);
		
		const s = [3,3,3];
		q = quat.fromEuler(quat.create(),0,0,0);	
		transform = mat4.fromRotationTranslationScale(mat4.create(),q, v, s);
		tcm = this.engine.getTransformManager();
		inst = tcm.getInstance(this.suzanne);
		tcm.setTransform(inst, transform);

		transform2 = mat4.fromTranslation(mat4.create(), [-5,-5,0])
		tcm2 = this.engine.getTransformManager();
		inst2 = tcm2.getInstance(this.suzanne2);
		tcm2.setTransform(inst2, transform2);

		transform3 = mat4.fromTranslation(mat4.create(), [5,-5,0])
		tcm3 = this.engine.getTransformManager();
		inst3 = tcm3.getInstance(this.suzanne3);
		tcm3.setTransform(inst3, transform3);	

		transform4 = mat4.fromTranslation(mat4.create(), [100,100,100])
		tcm4 = this.engine.getTransformManager();
		inst4 = tcm4.getInstance(this.suzanne4);
		tcm4.setTransform(inst4, transform4);	

		eye = [0,8,4];
		vec3.rotateY(eye, eye, center, radians);
		this.camera.lookAt(eye, center, up);
		
	}
	else if (count > 60000)
	{


		transform4 = mat4.fromScaling(mat4.create(), [4, 4, 4]);
		tcm4 = this.engine.getTransformManager();
		inst4 = tcm4.getInstance(this.suzanne4);
    		tcm4.setTransform(inst4, transform4);

		transform2 = mat4.fromTranslation(mat4.create(), [100,100,100])
		tcm2 = this.engine.getTransformManager();
		inst2 = tcm2.getInstance(this.suzanne2);
		tcm2.setTransform(inst2, transform2);

		transform3 = mat4.fromTranslation(mat4.create(), [100,100,100])
		tcm3 = this.engine.getTransformManager();
		inst3 = tcm3.getInstance(this.suzanne3);
		tcm3.setTransform(inst3, transform3);	

		transform = mat4.fromTranslation(mat4.create(), [100,100,100])
		tcm = this.engine.getTransformManager();
		inst = tcm.getInstance(this.suzanne);
		tcm.setTransform(inst, transform);	
		
		eye = [0,8,4];
		vec3.rotateZ(eye, eye, center, radians);
		this.camera.lookAt(eye, center, up);
		


	}
			
	
	
		
	
	this.renderer.render(this.swapChain, this.view);
        window.requestAnimationFrame(this.render);
//////////////////// END
}

    resize() {
        const dpr = window.devicePixelRatio;
        const width = this.canvas.width = window.innerWidth * dpr;
        const height = this.canvas.height = window.innerHeight * dpr;
        this.view.setViewport([0, 0, width, height]);

        const aspect = width / height;
        const Fov = Filament.Camera$Fov, fov = aspect < 1 ? Fov.HORIZONTAL : Fov.VERTICAL;
        this.camera.setProjectionFov(90, aspect, 0.1, 100, fov); //100 - 1 -1000 dog
//this.camera.setProjectionFov(45, aspect, 0.1, 100, fov); panda
    }
}
