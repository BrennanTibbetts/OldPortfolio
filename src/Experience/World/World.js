import Experience from "../Experience"
import Environment from "./Environment"
import WavySphere from "./Objects/WavySphere"
import SphereSystem from "./SphereSystem"
import * as THREE from 'three'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.story = new SphereSystem()

        // this.resources.on('ready', () => {

            // Setup
            this.environment = new Environment()
        // })

    }

    update(){
        // if (this.WavySphere) {
        //     this.WavySphere.update()
        // }

        this.environment.update()
        if(this.story){
            this.story.update()
        }
        
    }

}