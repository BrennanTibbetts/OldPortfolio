import Experience from "./Experience";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from "gsap";

export default class Camera {

    constructor(){
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.time = this.experience.time

        this.setInstance()
        this.setOrbitControls()
    }

    setInstance(){
        this.instance = new THREE.PerspectiveCamera(
            30, 
            this.sizes.width / this.sizes.height,
            0.1,
            100,
        )
        this.instance.position.set(25, 6, 25)
        this.scene.add(this.instance)
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.enablePan = false
        this.controls.rotateSpeed = 0.1
        this.controls.enableZoom = false
    }

    resize(){
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update();

        // If an object is selected, update the camera position relative to the selected object
        if (this.isObjectSelected && this.selectedObject) {
            this.instance.position.x = this.selectedObject.position.x * 2;
            this.instance.position.y = 0; 
            this.instance.position.z = this.selectedObject.position.z * 2;
        }
    }

    deselectObject() {
        if (this.controls.enabled == false) {
            gsap.to(this.instance.position, {
                x: this.lastPosition.x,
                y: this.lastPosition.y,
                z: this.lastPosition.z,
                duration: 1
            });

            this.controls.enabled = true;
            this.isObjectSelected = false; // Reset the flag when the object is deselected
            this.selectedObject = null; // Clear the selected object reference
        }
    }

    selectObject(mesh, position) {
        if (this.controls.enabled == true) {
            this.lastPosition = {
                x: this.instance.position.x,
                y: this.instance.position.y,
                z: this.instance.position.z
            };
            this.controls.enabled = false;

            // Set the selected object and update the flag
            this.selectedObject = mesh;

            gsap.to(this.instance.position, {
                x: position.x * 2,
                y: 0,
                z: position.z * 2,
                duration: 1,
                onComplete: () => {
                    this.isObjectSelected = true;
                }
            })
        }
    }
}