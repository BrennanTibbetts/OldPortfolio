import gsap from "gsap"
import Experience from "../Experience"
import WavySphere from "./Objects/WavySphere"
import * as THREE from 'three'
import Raycaster from "../Raycaster"

export default class SphereSystem{
    constructor() {
        this.experience = new Experience()
        this.world = this.experience.world
        this.time = this.experience.time
        this.systemRadius = 10 
        this.systemSpeed = 0.0001
        this.camera = this.experience.camera
        this.raycaster = new Raycaster()
        this.raycastSpheres = []
        this.boundaryRadius = 20

        this.debug = this.experience.debug

        this.insideColors = [ 0x55ff55, 0x007ab8, 0xffffff, 0xffa500, 0xff00ff, 0x0051ff, 0xffdba8, 0xe69898 ]
        this.outsideColors = [ 0x000000, 0xffffff, 0x007ab8, 0xffa500, 0x000000, 0xffffff, 0xe69898, 0xffdba8 ]

        this.projects = [
            {
                params: {
                    title: "SpotiFriend",
                    size: 1.4,
                    insideColor: 0x55ff55,
                    outsideColor: 0x000000,
                    speed: 0.0005,
                    colorSteepness: 4.2,
                    amplitude: 0.1,
                    frequency: 50,
                    displacementSkew: new THREE.Vector3(0.5, 2.0, 1.0),
                    noise: false,
                    raySize: 0.8
                }
            },
            {
                params: {
                    title: "LangLM",
                    size: 1.0,
                    insideColor: 0xffffff,
                    outsideColor: 0x007ab8,
                    speed: 0.0013,
                    colorSteepness: 1.68,
                    amplitude: 0.68,
                    frequency: 33.19,
                    displacementSkew: new THREE.Vector3(1.0, 1.0, 0.0),
                    noise: false,
                    raySize: 0.9
                }
            },
            {
                params: {
                    title: "Netjets",
                    size: 0.5,
                    insideColor: 0x0051ff,
                    outsideColor: 0xffffff,
                    colorSteepness: 1.2,
                    amplitude: 0.61,
                    frequency: 600,
                    displacementSkew: new THREE.Vector3(1.0, 0.0, 0.0),
                    noise: false,
                    raySize: 0.7
                    // fbm: true
                }
            },
            {
                params: {
                    title: "OS3",
                    size: 0.9,
                    insideColor: 0xffffff,
                    outsideColor: 0xffa500,
                    colorSteepness: 2000,
                    amplitude: 0.25,
                    frequency: 100,
                    displacementSkew: new THREE.Vector3(1.0, 0.5, 0.0),
                    noise: true,
                    raySize: 0.5
                }
            },
            {
                params: {
                    title: "Rhythm",
                    size: 1.0,
                    insideColor: 0xff00ff,
                    outsideColor: 0xffffff,
                    colorSteepness: 4,
                    amplitude: 2,
                    speed: 0.0005,
                    frequency: 100,
                    displacementSkew: new THREE.Vector3(0.17, 1.3, 0.5),
                    noise: true,
                    fbm: true,
                    raySize: 0.7
                }
            },
            {
                params: {
                    title: "Mario",
                    size: 1.0,
                    insideColor: 0xffdba8,
                    outsideColor: 0xe69898,
                    colorSteepness: 15.42,
                    amplitude: 0.7,
                    speed: 0.0009,
                    frequency: 71,
                    displacementSkew: new THREE.Vector3(1.00, 1.0, 1.0),
                    noise: true,
                    raySize: 0.6
                }
            }
        ]

        // Circular array
        this.projects.forEach((project, index) => {
            project.params.position = {
                x: Math.cos((index / this.projects.length) * Math.PI * 2) * this.systemRadius,
                y: 0,
                z: Math.sin((index / this.projects.length) * Math.PI * 2) * this.systemRadius
            }
        })

        this.activeLayers = false
        this.currentIndex = -1

        this.raycaster.on('click', (object) => {
            this.selectProject(object) 
        })

        this.setWavySpheres()

        if(this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('SphereSystem')
            this.debugFolder.add(this, 'systemRadius').step(0.1).min(0).max(20)
        } 

    }

    setWavySpheres(){
        const boundaryMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            visible: false
        })
        const boundaryGeometry = new THREE.SphereGeometry(2, 32, 32)
        this.projects.forEach((project) => {
            project.WavySphere = new WavySphere(project.params)
            project.rayCastSphere = new THREE.Mesh(
                boundaryGeometry,
                boundaryMaterial
            )
            project.rayCastSphere.scale.set(project.params.raySize, project.params.raySize, project.params.raySize)
            project.rayCastSphere.position.set(project.params.position.x, project.params.position.y, project.params.position.z)
            project.rayCastSphere.name = project.params.title
            this.raycastSpheres.push(project.rayCastSphere)
            this.experience.scene.add(project.rayCastSphere)
        })

        const largeBoundaryMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            side: THREE.BackSide,
            visible: false
        })
        const boundarySphere = new THREE.Mesh(
            boundaryGeometry,
            largeBoundaryMaterial
        )
        boundarySphere.name = "boundary"
        boundarySphere.scale.set(this.boundaryRadius, this.boundaryRadius, this.boundaryRadius)
        this.experience.scene.add(boundarySphere)
        this.raycastSpheres.push(boundarySphere)
        this.raycaster.setRaycastObjects(this.raycastSpheres)
    }

    selectProject(object){

        this.lastIndex = this.currentIndex
        this.currentIndex = this.projects.findIndex((project) => {
            return project.params.title === object
        })
        console.log(this.currentIndex)

        if(this.currentIndex !== -1 && this.lastIndex == -1){
            const projectedPosition = {
                x: Math.cos(((this.time.elapsed + 1000) * this.systemSpeed) + (this.currentIndex / this.projects.length) * Math.PI * 2) * this.systemRadius,
                y: 0,
                z: Math.sin(((this.time.elapsed + 1000) * this.systemSpeed) + (this.currentIndex / this.projects.length) * Math.PI * 2) * this.systemRadius
            }
            this.camera.selectObject(this.projects[this.currentIndex].WavySphere.mesh, projectedPosition)
            document.querySelectorAll(`#${this.projects[this.currentIndex].params.title} .title`).forEach((project) => {
                project.classList.add('animate-title')
                project.classList.remove('hidden')
                project.classList.remove('animate-title-back')
            })
            document.querySelectorAll(`#${this.projects[this.currentIndex].params.title} .left`).forEach((left) => {
                left.classList.add('animate-left')
                left.classList.remove('hidden')
                left.classList.remove('animate-left-back')
            })
            document.querySelectorAll(`#${this.projects[this.currentIndex].params.title} .right`).forEach((right) => {
                right.classList.add('animate-right')
                right.classList.remove('hidden')
                right.classList.remove('animate-right-back')
            })
        } else if(this.lastIndex != -1 && this.currentIndex == -1){
            this.camera.deselectObject()
            document.querySelectorAll(`#${this.projects[this.lastIndex].params.title} .title`).forEach((title, index) => {
                title.classList.add('animate-title-back')
                title.classList.add('hidden')
                title.classList.remove('animate-title')
            })
            document.querySelectorAll(`#${this.projects[this.lastIndex].params.title} .left`).forEach((left, index) => {
                left.classList.remove('animate-left')
                left.classList.add('animate-left-back')
                left.classList.add('hidden')
            })
            document.querySelectorAll(`#${this.projects[this.lastIndex].params.title} .right`).forEach((right, index) => {
                right.classList.remove('animate-right')
                right.classList.add('animate-right-back')
                right.classList.add('hidden')
            })
        }
    }

    update(){

        this.projects.forEach((project, index) => {
            if(project.WavySphere){
                project.WavySphere.update()
                project.WavySphere.mesh.position.x = Math.cos((this.time.elapsed * this.systemSpeed) + (index / this.projects.length) * Math.PI * 2) * this.systemRadius
                project.WavySphere.mesh.position.z = Math.sin((this.time.elapsed * this.systemSpeed) + (index / this.projects.length) * Math.PI * 2) * this.systemRadius

                project.rayCastSphere.position.x = project.WavySphere.mesh.position.x
                project.rayCastSphere.position.z = project.WavySphere.mesh.position.z

            }
        })

        if(this.time.elapsed % 50 < 0.1){
            this.projects[4].WavySphere.updateParams({
                insideColor: this.insideColors[Math.floor(Math.random() * this.insideColors.length)], 
                outsideColor: this.outsideColors[Math.floor(Math.random() * this.outsideColors.length)]
            })
        }

    }
}