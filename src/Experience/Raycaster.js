import * as THREE from 'three';
import Experience from './Experience';
import EventEmitter from './Utils/EventEmitter';

export default class Raycaster extends EventEmitter{

    constructor() {

        super()

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera.instance
        this.mouse = new THREE.Vector2()
        this.instance = new THREE.Raycaster()
        this.intersects = []
        this.setEvents()
    }

    setRaycastObjects(objects) {
        this.objects = objects
    }

    setEvents() {

        this.mouse = {
            x: 0,
            y: 0
        }

        let isDragging = false; // Remove the unused variable

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / this.sizes.width) * 2 -1
            this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1

        });

        this.experience.canvas.addEventListener('mousedown', () => {
            isDragging = false; // Reset the isDragging flag on mouse down
        });

        this.experience.canvas.addEventListener('mousemove', () => {
            isDragging = true; // Set the isDragging flag on mouse move
        });

        this.experience.canvas.addEventListener('mouseup', () => {
            if (!isDragging) { // Only trigger the click event if not dragging
                this.instance.setFromCamera(this.mouse, this.camera)
                this.intersects = this.instance.intersectObjects(this.objects, false)

                if(this.intersects.length){
                    const name = this.intersects[0].object.name
                    console.log(name)
                    this.trigger('click', [name])
                }
            }
        });
    }

}