
function addCat() {


    

   

    var bone = new Cube();
    //bone.matrix.translate(0,0,0);
    bone.matrix.translate(g_camera.eye.elements[0], 0, g_camera.eye.elements[2]);
    bone.matrix.scale(0.3, 0.3, 0.3);
    //bone.matrix.rotate(-g_camera.at.elements[0]+100,0,1,0);
    //console.log(1.7647*g_camera.at.elements[0]+21+160);
    bone.render();

    var box = new Cube();
    if (!box) throw new Error('Failed to create the Cube object.');
    box.matrix = bone.matrix;
    box.color = [1, 0, 1, 1];
    box.textureNum = 1;
    box.matrix.translate(0, 0, -5);

    var head = new Sphere();
    head.matrix = bone.matrix;
    head.matrix.scale(1, 0.75, 1);
    head.color = [0.3, 0.55, 1, 1];
    head.matrix.translate(0, 0, -1);
    head.textureNum = 2;
    head.render();

    var tri = new Tetrahedron();
    tri.matrix  = head.matrix;
    tri.color = [0.3, 0.55, 1, 1];
    //tri.matrix.scale(1,1.5,1);
    tri.matrix.translate(0.02, 0.53, 0);
    tri.render();

    var tri2 = new Tetrahedron();
    tri2.matrix  = head.matrix;
    tri2.color = [0.3, 0.55, 1, 1];
    //tri2.matrix.scale(1,1.5,1);
    tri2.matrix.translate(-0.82, 0.05, 0);
    tri2.render();

    var skirt = new Cylinder();
    skirt.matrix = head.matrix;
    skirt.textureNum = 0;
    skirt.matrix.scale(0.8,1.3,1.2);
    //skirt.color = [1, 0.2, 0.4, 1];
    skirt.overrideColor = [0.7, 0.1, 0.7, 0.1, 0.7, 0.1];
    skirt.matrix.translate(0.98, -1.4, 0.15);
    skirt.render();

    var sleeve = new Cube();
    sleeve.color = [1, 0.3, 0.4, 1];
    /*sleeve.matrix.rotate(-1 * g_yellowAngle / 4, 0, 0, 1);
    if (g_armAnimation) {
      sleeve.matrix.rotate(g_armAngle / 4, 1, 0, 1);
    }*/
    sleeve.matrix = skirt.matrix;
    //sleeve.matrix.scale(0.17, 0.09, 0.17);
    sleeve.matrix.scale(0.3,0.3,0.3);
    sleeve.matrix.translate(-2, -0.9, -0.3);
    sleeve.render();

    var sleeve2 = new Cube();
    /*sleeve2.matrix.rotate(1 * g_yellowAngle / 4, 0, 0, 1);
    if (g_armAnimation) {
      sleeve2.matrix.rotate(g_armAngle / 4, 1, 0, 1);
    }*/
    sleeve2.matrix = skirt.matrix;
    sleeve2.color = [1, 0.3, 0.4, 1];
    sleeve2.matrix.scale(0.17, 0.09, 0.17);
    sleeve2.matrix.translate(0.1, -0.9, -0.3);
    sleeve2.render();


    g_yellowAngle = 0
    g_armAngle = 0
    addLeftArm(0.5, g_yellowAngle, g_armAngle);
    addRightArm(-0.5, g_yellowAngle, g_armAngle);
    addLeftLeg(g_yellowAngle);
    addRightLeg(g_yellowAngle);



}
function addEars1(color, matrix) {

    var tri = new Tetrahedron();
    tri.matrix = matrix;
    tri.color = color;
    tri.matrix.scale(0.3, 0.4, 0.4);
    tri.matrix.translate(0.05, 0.95, 0);
    tri.render();

    var tri2 = new Tetrahedron();
    tri2.color = color;
    tri2.matrix.scale(0.3, 0.4, 0.4);
    tri2.matrix.translate(-0.85, 0.95, 0);
    tri2.render();

}


function addLeftArm(p, angle, armAngle) {
    var cube = new Cube();
    cube.color = [0.3, 0.55, 1, 1];

    cube.matrix.rotate(-23 - angle / 3, 0, 0, 1);
    cube.matrix.rotate(angle / 3, 1, 0, 0);
    cube.matrix.rotate(armAngle / 3, 1, 0, 1);
    cube.matrix.scale(0.07, 0.18, 0.07);
    cube.matrix.translate(-2.6 + p, -1.58, -0.08);

    cube.render();

    var cube3 = new Cube();
    cube3.color = [1, 0.5, 0.5, 1];
    cube3.matrix = cube.matrix;
    cube3.matrix.scale(1.25, 0.25, 0.5);
    cube3.matrix.translate(-0.6 + p, 0.2, -0.08);
    cube3.render();


    var cube2 = new Cube();
    cube2.matrix = cube3.matrix;
    cube2.color = [0.3, 0.55, 1, 1];
    cube2.matrix.scale(1.5, 2, 2);
    cube2.matrix.translate(-0.2, -1, 0);
    cube2.render();

}


function addRightArm(p, angle, armAngle) {

    var cube = new Cube();
    cube.color = [0.3, 0.55, 1, 1];
    cube.matrix.rotate(23 + angle / 3, 0, 0, 1);
    cube.matrix.rotate(-angle / 3, 1, 0, 0);
    cube.matrix.rotate(armAngle / 3, 1, 0, 1);

    cube.matrix.scale(0.07, 0.14, 0.07);
    cube.matrix.translate(1.5 + p, -1.6, -0.08);
    cube.render();

    var cube3 = new Cube();
    cube3.matrix = cube.matrix;
    cube3.color = [1, 0.5, 0.5, 1];
    //cube3.matrix.rotate(25 + angle/3,0,0,1);
    cube3.matrix.scale(1.2, 0.35, 0.5);
    cube3.matrix.translate(0.5 + p, -1, -0.08);
    cube3.render();


    var cube2 = new Cube();
    cube2.matrix = cube3.matrix;
    cube2.color = [0.3, 0.55, 1, 1];
    cube2.matrix.scale(1.5, 2, 2);
    cube2.matrix.translate(-0.1, -1, 0);
    cube2.render();



}


function addLeftLeg(angle) {

    var cube = new Cube();
    cube.color = [0.3, 0.55, 1, 1];
    cube.matrix.scale(0.1, 0.18, 0.1);
    cube.matrix.translate(-1.3, -2.9 + angle / 500, -0.8 - angle / 100);
    cube.matrix.rotate(5 + angle / 1.5, 1, 0, 0);
    cube.render();

    var legMat = new Matrix4(cube.matrix);

    var pink = new Cube();
    pink.color = [1, 0.5, 0.5, 1];
    pink.matrix = legMat;
    pink.matrix.scale(1.2, 0.3, 1.2);
    pink.matrix.translate(-0.1, -0.8, -0.1);
    pink.render();

    var foot = new Cube();
    foot.matrix = legMat;
    foot.color = [0.3, 0.55, 1, 1];
    foot.matrix.scale(0.9, 3.5, 0.7)
    foot.matrix.rotate(-20 + angle / 2, 1, 0, 0);
    foot.matrix.translate(0, -0.95, 0.2);
    foot.render();
}



function addRightLeg(angle) {
    var cube = new Cube();
    cube.color = [0.3, 0.55, 1, 1];
    cube.matrix.scale(0.1, 0.18, 0.1);
    cube.matrix.translate(0.5, -2.9 - angle / 500, -0.8 + angle / 100);
    cube.matrix.rotate(5 - angle / 1.5, 1, 0, 0);
    cube.render();

    var legMat = new Matrix4(cube.matrix);

    var pink = new Cube();
    pink.color = [1, 0.5, 0.5, 1];
    pink.matrix = legMat;
    pink.matrix.scale(1.2, 0.3, 1.2);
    pink.matrix.translate(-0.1, -0.8, -0.1);
    pink.render();

    var foot = new Cube();
    foot.matrix = legMat;
    foot.color = [0.3, 0.55, 1, 1];
    foot.matrix.scale(0.9, 3.5, 0.7)
    foot.matrix.rotate(-20 + angle / 2, 1, 0, 0);
    foot.matrix.translate(0, -0.95, 0.2);
    foot.render();


}