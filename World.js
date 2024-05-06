// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;

  attribute vec4 a_Position;
  attribute vec2 a_UV;

  varying vec2 v_UV;
  
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`



// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;

  uniform sampler2D u_Sampler6;
  uniform sampler2D u_Sampler7;
  uniform sampler2D u_Sampler8;
  uniform sampler2D u_Sampler9;
  uniform int u_whichTexture;
  void main() {
    if(u_whichTexture == -2){
       gl_FragColor = u_FragColor;                  // Use color
    } else if (u_whichTexture == -1){
       gl_FragColor = vec4(v_UV, 1.0, 1.0);         // Use UV debug color
    } else if(u_whichTexture == 0){
       gl_FragColor = texture2D(u_Sampler0, v_UV);  // Use texture0
    } else if(u_whichTexture == 1){
       gl_FragColor = texture2D(u_Sampler1, v_UV); 
    } else if(u_whichTexture == 2){
        gl_FragColor = texture2D(u_Sampler2, v_UV); 
    } else if(u_whichTexture == 3){
        gl_FragColor = texture2D(u_Sampler3, v_UV); 
    } else if(u_whichTexture == 4){
      gl_FragColor = texture2D(u_Sampler4, v_UV); 
  }  else if(u_whichTexture == 5){
    gl_FragColor = texture2D(u_Sampler5, v_UV); 
} else if(u_whichTexture == 6){
  gl_FragColor = texture2D(u_Sampler6, v_UV); 
} else if(u_whichTexture == 7){
  gl_FragColor = texture2D(u_Sampler7, v_UV); 
} else if(u_whichTexture == 8){
  gl_FragColor = texture2D(u_Sampler8, v_UV); 
} else if(u_whichTexture == 9){
  gl_FragColor = texture2D(u_Sampler9, v_UV); 
} else {
       gl_FragColor = vec4(1,.2,.2,1);   
                  // Error, Red [1, 0.3, 0.4, 1];
    }

  }`
let canvas;
let gl;
let a_Position;
let u_FragColor;
let a_UV;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let g_globalAngle = 0;
let u_Sampler0;
let u_Sampler1, u_Sampler2, u_Sampler3, u_Sampler4, u_Sampler5, u_Sampler6, u_Sampler7, u_Sampler8, u_Sampler9;
let g_grassAnimation = false;
let g_grassAngle = 0;
let rotate_value = 0;
let g_nightMode = false;
let u_whichTexture;
let g_camera = new Camera();

// map is flipped horizontally
var g_map_grass = [
  [1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,],
  [0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,],
  [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],

  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],

];

var g_map_grass_y = [
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 1, 1, 0,],
  [0, 0, 0, 1, 1, 0, 1, 1, 1, 2, 3, 3, 3, 2, 1, 0, 1, 1, 0,],
  [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 0, 1, 1, 0,],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,],
  [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 1, 0, 0,],
  [0, 0, 0, 1, 1, 1, 2, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 2, 3, 4, 4, 4, 3, 2, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 2, 3, 4, 4, 4, 3, 2, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 2, 3, 4, 4, 4, 3, 3, 2, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 2, 3, 4, 4, 4, 4, 3, 3, 2, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],

  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
];

function drawMap() {
  //const { g_map_grass, g_map_grass_y } = generateMaps(22, 16);
  //console.log(g_map_grass)
  let y_offset = 0;
  //var body = new Cube();
  for (x = 0; x < 25; x++) {
    for (y = 0; y < 25; y++) {
      // console.log(x, y);
      if (g_map_grass[x][y] > 0 && g_map_grass[x][y] < 6) {
        for (z = 0; z < g_map_grass[x][y]; z++) {

          /*if(g_map_dirt[x][y] != 0){
            y_offset = g_map_dirt[x][y]+0;
          }*/
          var body = new Cube();
          body.dirt = true;
          body.color = [0.8, 1.0, 1.0, 1.0];
          if (g_nightMode) {
            body.textureNum = 7;
          } else {
            body.textureNum = 2;
          }
          body.matrix.translate(0, -0.75, 0);
          body.matrix.scale(0.5, 0.48, 0.5);
          body.matrix.translate(x - 9, g_map_grass_y[x][y] - 0.8, y - 9);
          body.renderfaster();

          var grass = new Cube();
          grass.color = [0.2, 0.6, 0.4, 1.0];
          if (g_nightMode) {
            grass.textureNum = 8;
          } else {
            grass.textureNum = 3;
          }
          grass.matrix.translate(0, -0.75, 0);
          grass.matrix.scale(0.5, 0.02, 0.5);
          grass.matrix.translate(x - 9, 24 + g_map_grass_y[x][y] + g_map_grass_y[x][y] * 23 - 20, y - 9);
          grass.renderfaster();
        }

        y_offset = 0;
      }
    }
  }
}

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);


}
function connectVariablesToGLSL() {

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get u_whichTexture');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to create the u_Sampler1 object');
    return;
  }

  // get the storage location of u_Sampler1
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to create the u_Sampler2 object');
    return;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to create the u_Sampler3 object');
    return;
  }

  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to create the u_Sampler4 object');
    return;
  }

  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
  if (!u_Sampler5) {
    console.log('Failed to create the u_Sampler5 object');
    return;
  }

  u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
  if (!u_Sampler6) {
    console.log('Failed to create the u_Sampler6 object');
    return;
  }

  u_Sampler7 = gl.getUniformLocation(gl.program, 'u_Sampler7');
  if (!u_Sampler7) {
    console.log('Failed to create the u_Sampler7 object');
    return;
  }

  u_Sampler8 = gl.getUniformLocation(gl.program, 'u_Sampler8');
  if (!u_Sampler8) {
    console.log('Failed to create the u_Sampler7 object');
    return;
  }

  u_Sampler9 = gl.getUniformLocation(gl.program, 'u_Sampler9');
  if (!u_Sampler9) {
    console.log('Failed to create the u_Sampler9 object');
    return;
  }


  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}




function addActionsForHtmlUI() {


  document.getElementById('angleSlide').addEventListener('mousemove', function () { g_globalAngle = this.value; renderAllShapes(); });

  document.getElementById('nightModeOn').onclick = function () { g_nightMode = true; };
  document.getElementById('nightModeOff').onclick = function () { g_nightMode = false; };


}

function loadTexture(textureUnit, url, callback) {
  var image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  image.onload = function () {
    var texture = gl.createTexture();
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Call the callback function if provided
    if (callback) {
      callback(texture);
    }

    console.log('Texture loaded from ' + url);
  };

  image.src = url;
}

function initTextures() {
  loadTexture(gl.TEXTURE0, './assets/grass.png', function (texture) {
    gl.uniform1i(u_Sampler0, 0);
  });
  loadTexture(gl.TEXTURE1, './assets/sky.png', function (texture) {
    gl.uniform1i(u_Sampler1, 1);
  });
  loadTexture(gl.TEXTURE2, './assets/dirt-with-grass.png', function (texture) {
    gl.uniform1i(u_Sampler2, 2);
  });
  loadTexture(gl.TEXTURE3, './assets/dirt-top.png', function (texture) {
    gl.uniform1i(u_Sampler3, 3);
  });
  loadTexture(gl.TEXTURE4, './assets/dirt.png', function (texture) {
    gl.uniform1i(u_Sampler4, 4);
  });
  loadTexture(gl.TEXTURE5, './assets/night-sky.png', function (texture) {
    gl.uniform1i(u_Sampler5, 5);
  });
  loadTexture(gl.TEXTURE6, './assets/night-grass.png', function (texture) {
    gl.uniform1i(u_Sampler6, 6);
  });

  loadTexture(gl.TEXTURE7, './assets/night-dirt-with-grass.png', function (texture) {
    gl.uniform1i(u_Sampler7, 7);
  });

  loadTexture(gl.TEXTURE8, './assets/night-dirt-top.png', function (texture) {
    gl.uniform1i(u_Sampler8, 8);
  });

  loadTexture(gl.TEXTURE9, './assets/scary-head.png', function (texture) {
    gl.uniform1i(u_Sampler9, 9);
  });
}



function renderAllShapes() {

  var startTime = performance.now();


  // pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(60, 1 * canvas.width / canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();

  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  //viewMat.setLookAt(0,0,-1,  0,0,0,  0,1,0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);


  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);


  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //floor
  var floor = new Cube();
  floor.color = [1, 0, 0, 1];

  if (g_nightMode) {
    floor.textureNum = 6;
  } else {
    floor.textureNum = 0;
  }
  floor.matrix.translate(0, -0.75, 0);
  floor.matrix.scale(20, 2, 20);
  floor.matrix.translate(-0.5, -1, -0.5);
  floor.render()

  var sky = new Cube();
  sky.color = [1, 0, 1, 1];
  if (g_nightMode) {
    sky.textureNum = 5;
  } else {
    sky.textureNum = 1;
  }
  sky.matrix.rotate(-180, 1, 0, 0);
  sky.matrix.rotate(4 * Math.sin(g_seconds), 0, 1, 0);
  sky.matrix.scale(50, 50, 50);

  sky.matrix.translate(-0.5, -0.91, -0.5)
  sky.render();


  if(g_nightMode){
  var bone = new Cube();
    //bone.matrix.translate(0,0,0);

    bone.matrix.translate(g_camera.eye.elements[0], 0, g_camera.eye.elements[2]);
    bone.matrix.scale(0.3, 0.3, 0.3);
    bone.matrix.rotate(2*Math.sin(g_seconds+1)+3,1,0,1);
    //bone.matrix.rotate(-g_camera.at.elements[0]+100,0,1,0);
    //console.log(1.7647*g_camera.at.elements[0]+21+160);
    bone.render();


    var head = new Cube();
    head.matrix = bone.matrix;
    head.matrix.scale(1, 0.75, 1);
    head.color = [0.3, 0.55, 1, 1];
    head.matrix.translate(0, 0, 6);
    
    head.textureNum = 9;
    head.render();

  }
  
  var topSky = new Cube();
  topSky.color = [1, 0, 1, 1];
  if (g_nightMode) {
    topSky.textureNum = 5;
  } else {
    topSky.textureNum = 1;
  }

  topSky.matrix.scale(100, 1, 100);
  topSky.matrix.translate(-0.5, 40, -0.5)
  topSky.render();

  var backSky = new Cube();
  backSky.color = [1, 0, 1, 1];
  if (g_nightMode) {
    backSky.textureNum = 5;
  } else {
    backSky.textureNum = 1;
  }
  
  backSky.matrix.rotate(-180, 1, 0, 0);
  backSky.matrix.rotate(6*Math.sin(g_seconds), 0, 1, 0);
  backSky.matrix.scale(50, 50, 50);
  backSky.matrix.translate(-0.5, -0.91, -1.4)
  backSky.render();

  offset_value = g_camera.at.elements[0] + 110;


  drawMap();
  drawGrass();

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "numdot");


}


function drawGrass() {


  function hash(value) {
    value = ((value >> 16) ^ value) * 0x45d9f3b;
    value = ((value >> 16) ^ value) * 0x45d9f3b;
    value = (value >> 16) ^ value;
    return value;
  }

  // Use hashing instead of Math.random() for pseudo-randomness
  var seed = 205; // Seed value for consistent pseudo-randomness
  for (x = 0; x < 70; x++) {
    var blade_1 = new Cube();
    blade_1.textureNum = -2;

    if (g_nightMode) {
      blade_1.color = [0.05, 0.05, 0.2, 1];
    } else {

      blade_1.color = [0.3, 0.6, 0.2, 1];
    }
    blade_1.matrix.scale(0.012, 0.05, 0.012);

    // Generate pseudo-random coordinates using hashing
    var randomX = hash(seed + x) % 350 - 100; // Pseudo-random x-coordinate between -50 and 50
    var randomZ = hash(seed + x * 2) % 1000 - 300; // Pseudo-random z-coordinate between -50 and 50

    blade_1.matrix.translate(randomX, -13.3, randomZ);

    blade_1.renderfaster();


    var blade_2 = new Cube();
    blade_2.textureNum = -2;
    if (g_nightMode) {
      blade_2.color = [0.05, 0.05, 0.2, 1];
    } else {

      blade_2.color = [0.3, 0.6, 0.2, 1];
    }
    blade_2.matrix = blade_1.matrix;
    blade_2.matrix.scale(1, 2, 1);
    blade_2.matrix.translate(-2, 0, 0)
    //blade_2.matrix.rotate(20/g_grassAngle,1,1,1);
    //console.log(g_grassAngle);
    blade_2.renderfaster();

    var blade_3 = new Cube();
    blade_3.textureNum = -2;
    if (g_nightMode) {
      blade_3.color = [0.05, 0.05, 0.2, 1];
    } else {

      blade_3.color = [0.3, 0.6, 0.2, 1];
    }
    blade_3.matrix = blade_2.matrix;
    blade_3.matrix.scale(1, 0.8, 1);
    blade_3.matrix.translate(-2, 0, 0)
    //blade_2.matrix.rotate(20/g_grassAngle,1,1,1);
    blade_3.renderfaster();

    var blade_4 = new Cube();
    blade_4.textureNum = -2;
    if (g_nightMode) {
      blade_4.color = [0.05, 0.05, 0.2, 1];
    } else {

      blade_4.color = [0.3, 0.6, 0.2, 1];
    }
    blade_4.matrix = blade_2.matrix;
    blade_4.matrix.scale(1, 0.2 * (Math.abs(randomX) / 80), 1);
    blade_4.matrix.translate(-2, 0, 0);
    blade_4.renderfaster();

  }


}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}



function setupMouseControls() {
  let lastX, lastY;
  let dragging = false;



  canvas.addEventListener('mousedown', function (event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
  });

  canvas.addEventListener('mousemove', function (event) {
    if (dragging) {
      var deltaX = event.clientX - lastX;
      var deltaY = event.clientY - lastY;

      if (deltaX !== 0) {
        if (deltaX > 0) {
          g_camera.panR(10*deltaX); 
        } else {
          g_camera.panL(-10*deltaX); 
        }
      }
      if (deltaY !== 0) {
        if (deltaY > 0) {
          g_camera.panD(50*deltaY); 
        } else {
          g_camera.panU(-50*deltaY); 
        }
      }

      lastX = event.clientX;
      lastY = event.clientY;
      renderAllShapes();
    }
  });

  canvas.addEventListener('mouseup', function () {
    dragging = false;
  });

  canvas.addEventListener('mouseleave', function () {
    dragging = false;
  });

}





var g_eye = [0, 0, 3];
var g_at = [0, 0, -100];
var g_up = [0, 1, 0];

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();
  setupMouseControls();
  initTextures();
  //loadOBJFile('path/to/your/model.obj');
  document.onkeydown = keydown;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

function toggleMenuAndOverlay(ev) {

  var menu = document.getElementById('menuPopup');
  var overlay = document.getElementById('canvasOverlay');

  // Create the overlay if it doesn't exist
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'canvasOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(5, 60, 114, 0.8)'; // Dark blue with transparency
    overlay.style.zIndex = '999'; // Ensure it covers the canvas but is below the menu
    overlay.style.display = 'none'; // Start hidden
    document.body.appendChild(overlay);

    // Click on overlay to close menu
    overlay.addEventListener('click', function () {
      overlay.style.display = 'none';
      menu.style.display = 'none';
    });
  }

  // Toggle display of the menu and overlay
  var isMenuVisible = menu.style.display === 'block';
  menu.style.display = isMenuVisible ? 'none' : 'block';
  overlay.style.display = isMenuVisible ? 'none' : 'block';
}



let createCube = false;
function keydown(ev) {

  if (ev.keyCode === 16) { // Shift key
    var menu = document.getElementById('menuPopup');
    var overlay = document.getElementById('canvasOverlay');

    // Check if the overlay doesn't exist and create it
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'canvasOverlay';
      document.body.appendChild(overlay);
    }

    // Toggle display of the menu and overlay
    var isMenuVisible = menu.style.display === 'block';
    menu.style.display = isMenuVisible ? 'none' : 'block';
    overlay.style.display = isMenuVisible ? 'none' : 'block';
  }
  if (ev.keyCode === 32) {
    g_camera.jump()
  }

  if (ev.keyCode === 82) {
    console.log("R");
    createCube = true;

  }
  if (ev.keyCode == 39 || ev.keyCode == 68) { // right
    g_camera.right();
  } else if (ev.keyCode == 37 || ev.keyCode == 65) { // left
    g_camera.left();
  } else if (ev.keyCode == 40 || ev.keyCode == 83) { // down 
    g_camera.backward();
  } else if (ev.keyCode == 38 || ev.keyCode == 87) { // up
    g_camera.forward();

  } else if (ev.keyCode == 81) { // q
    g_camera.panL();
  } else if (ev.keyCode == 69) { // e
    g_camera.panR();
  }
  renderAllShapes();

  //console.log(ev.keyCode);
}


var g_startTime = performance.now() / 1000;
var g_seconds = performance.now() / 1000 - g_startTime;

function tick() {

  g_seconds = performance.now() / 1000 - g_startTime;
  //console.log(g_seconds);
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);

}

function updateAnimationAngles() {
  if (g_grassAnimation) {
    g_grassAngle = (45 * Math.sin(g_seconds));
    console.log("clicked");
  }



}