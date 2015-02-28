if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var renderer, scene, camera, stats;
	var pointclouds;
	var mouse = new THREE.Vector2();

	var positions;
	var colors;

	var threshold = 0.1;
	var NZPointSize = 0.05;

	var lines = [];



	$(document).ready(function() {
		collectNZxyzData();

	});

	
	//these functions collect the data required to build the point cloud and arcs

	function collectNZxyzData() {
	    $.ajax({
	        type: "GET",
	        url: "final_points.csv",
	        dataType: "text",
	        success: function(data) { 
	        	processData(data); 
	        }
	    });
	}


	function processData(allText) {
	
	    var allTextLines = allText.split(/\r\n|\n/);
	    for (var i=0; i<allTextLines.length; i++) {
	        var data = allTextLines[i].split(',');
	        lines.push(data);
	    }
	    init();
		animate();
	}

	

	//generates a dot for each point in NZ
	function generateNZPositionsAndColors(positions, colors) {
		
		var k = 0;

		var greenColorValue;

		
		for ( var i = 0; i < lines.length; i++ ) {

			var x = lines[i][0];
			var y = lines[i][1];
			var z = lines[i][2];
			
			positions[ 3 * k ] = x;
			positions[ 3 * k + 1 ] = y;
			positions[ 3 * k + 2 ] = z;

			greenColorValue = ((z/0.75)) + 0.3;
			
			if (z > 0.3) {
				colors[ 3 * k ] = 1;
				colors[ 3 * k + 1 ] = 1;
				colors[ 3 * k + 2 ] = 1;
			} else {
				colors[ 3 * k ] = 0;
				colors[ 3 * k + 1 ] = greenColorValue;
				colors[ 3 * k + 2 ] = 0;
			}

			k++;
		}
	}

	//generates a flat plane to go under 3D NZ
	function generatePlane(positions, colors) {
		
		var k = 0;

		for ( var c = 0; c < lines.length; c++ ) {
			var x = lines[c][0];
			var y = lines[c][1];
			var z = 0;
			
			positions[ 3 * k ] = x;
			positions[ 3 * k + 1 ] = y;
			positions[ 3 * k + 2 ] = z;

			var greenColorValue = ((z/0.75)) + 0.3;
			
			if (z > 0.3) {
				colors[ 3 * k ] = 1;
				colors[ 3 * k + 1 ] = 1;
				colors[ 3 * k + 2 ] = 1;
			} else {
				colors[ 3 * k ] = 0;
				colors[ 3 * k + 1 ] = greenColorValue;
				colors[ 3 * k + 2 ] = 0;
			}

			k++;
		}
	}


	//returns pointcloud of NZ and PoPs
	function generateGeometry(points, pointSize) {
		
		var geometry = new THREE.BufferGeometry();
		var numPoints = points.length;


		positions = new Float32Array( numPoints*3 );
		colors = new Float32Array( numPoints*3 );

		generateNZPositionsAndColors(positions,colors);
		generatePoPPositionsAndColors(positions,colors);
	
		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
		geometry.computeBoundingBox();


		var material = new THREE.PointCloudMaterial( { size: pointSize, vertexColors: THREE.VertexColors } );
		var pointcloud = new THREE.PointCloud( geometry, material );

		return pointcloud;
	}


	//return pointcloud for plane underneath NZ
	function generatePlaneGeometry(points, pointSize) {
		
		var geometry = new THREE.BufferGeometry();
		var numPoints = points.length;


		positions = new Float32Array( numPoints*3 );
		colors = new Float32Array( numPoints*3 );


		generatePlane(positions,colors,points);


		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
		geometry.computeBoundingBox();


		var material = new THREE.PointCloudMaterial( { size: pointSize, vertexColors: THREE.VertexColors } );
		var pointcloud = new THREE.PointCloud( geometry, material );

		return pointcloud;
	}


	function init() {

		scene = new THREE.Scene(); //create the scene
		container = document.getElementById( 'container' );

		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
		scene.add(camera); //add a camera to the scence
		camera.position.set(0,0,20); //at this position
		
		//these controls allow you to interact with the scene (i.e. zoom, rotate, etc)
		controls = new THREE.OrbitControls( camera );
		controls.damping = 0.2;
		controls.addEventListener( 'change', render );
		

		//generate the pointclouds and arcs
		pcNZ = generateGeometry( lines, NZPointSize );
		pcNZ.scale.set( 1,1,1 );
		pcNZ.position.set( 0,0,0 );
		scene.add( pcNZ );
		
		pcPlane = generatePlaneGeometry( lines, NZPointSize );
		pcPlane.scale.set( 1,1,1 );
		pcPlane.position.set( 0,0,0 );
		scene.add( pcPlane );

		
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0x002f70, 1 );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );

		raycaster = new THREE.Raycaster();
		raycaster.params.PointCloud.threshold = threshold;

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild( stats.domElement );

		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		//reacts to space bar and 'c' key press
		document.addEventListener( 'keydown', function(){
        	switch (event.keyCode) {
				case 32: //space bar
					timeline = new TimelineMax();
					camera.position.set(0,0,20);
					scene.position.set(0,0,0);
					break;
				case 67: //c
					moveCamera();
					break;
		}}, false );
		
	}


	function onDocumentMouseMove( event ) {

		event.preventDefault();

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	}

	
	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	//timeline for camera animation loop
	function moveCamera() {

		var timeline = new TimelineMax({repeat:-1}); //-1 = infinity

		//tween = smooth transition
		//camera.position = what is changing
		//5 = time taken for movement
		//x,y,z = new coordinates, i.e. where the camera.position is moving to
		timeline.append(new TweenMax(camera.position,20,
			{x:0,y:-10,z:3, onUpdate: function() {
                    camera.updateProjectionMatrix();
                    camera.up.set(0,0,1); //changes up direction to stop camera from rotating
                    scene.position.x = 0; //sets scene position as this i 
                    scene.position.y = 0;
                    scene.position.z = 0;
                    camera.lookAt(scene.position); //tells the camera to focus on the scene
                }}));
		
		timeline.append(new TweenMax(camera.position,20,
			{x:10,y:-5,z:3, onUpdate: function() {
                    camera.updateProjectionMatrix();
                    camera.up.set(0,0,1);
                    scene.position.x = 0;
                    scene.position.y = 0;
                    scene.position.z = 0;
                    camera.lookAt(scene.position);
                }}));
		
		timeline.append(new TweenMax(camera.position,20,
			{x:8,y:5,z:3, onUpdate: function() {
                    camera.updateProjectionMatrix();
                    camera.up.set(0,0,1);
                    scene.position.x = 0;
                    scene.position.y = 0;
                    scene.position.z = 0;
                    camera.lookAt(scene.position);
                }}));


		timeline.append(new TweenMax(camera.position,20,
			{x:0,y:8,z:3, onUpdate: function() {
                    camera.updateProjectionMatrix();
                    camera.up.set(0,0,1);
                    scene.position.x = 0;
                    scene.position.y = 0;
                    scene.position.z = 0;
                    camera.lookAt(scene.position);
                }}));


		timeline.append(new TweenMax(camera.position,20,
			{x:-8,y:8,z:3, onUpdate: function() {
                    camera.updateProjectionMatrix();
                    scene.position.x = 0;
                    scene.position.y = 0;
                    scene.position.z = 0;
                    camera.lookAt(scene.position);
                }}));

		timeline.append(new TweenMax(camera.position,20,
			{x:-8,y:-8,z:3, onUpdate: function() {
                    camera.updateProjectionMatrix();
                    scene.position.x = 0;
                    scene.position.y = 0;
                    scene.position.z = 0;
                    camera.lookAt(scene.position);
                }}));

		timeline.append(new TweenMax(camera.position,20,
			{x:10,y:-20,z:3, onUpdate: function() {
                    camera.updateProjectionMatrix();
                    scene.position.x = 0;
                    scene.position.y = 0;
                    scene.position.z = 0;
                    camera.lookAt(scene.position);
                }}));


		timeline.append(new TweenMax(camera.position,20,
			{x:0,y:-10,z:3, onUpdate: function() {
                    camera.updateProjectionMatrix();
                    scene.position.x = 0;
                    scene.position.y = 0;
                    scene.position.z = 0;
                    camera.lookAt(scene.position);
                }}));

		timeline.append(new TweenMax(camera.position,20,
			{x:0,y:0,z:20, onUpdate: function() {
                    camera.updateProjectionMatrix();
                    scene.position.x = 0;
                    scene.position.y = 0;
                    scene.position.z = 0;
                    camera.lookAt(scene.position);
                }}));

		//anther listener for space bar and 'c' keypress
		document.addEventListener( 'keydown', function(){
        	switch (event.keyCode) {
				case 32: //space bar
					timeline.pause(); //stop the timeline
					timeline = new TimelineMax(); //creates a new timeline to return camera to start position
					timeline.append(new TweenMax(camera.position,5,
						{x:0,y:0,z:20, onUpdate: function() {
                        camera.updateProjectionMatrix();
                        camera.up.set(0,0,0);
                        scene.position.x = 0;
                        scene.position.y = 0;
                        scene.position.z = 0;
                        camera.lookAt(scene.position);
                    }}));
					break;
				case 67: //c
					//restart the timeline whenever 'c' is pressed
					timeline.restart();
					break;
			}}, false);
	}

	
	function animate() {
		
		requestAnimationFrame( animate );

		render();
		stats.update();

	}


	function render() {				camera.updateProjectionMatrix();
		renderer.render( scene, camera );

	}

