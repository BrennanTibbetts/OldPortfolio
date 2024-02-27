import * as THREE from 'three'
import Experience from "../Experience";
import vertexShader from './shaders/points/vertex.glsl'
import fragmentShader from './shaders/points/fragment.glsl'

export default class Environment {

    constructor(){

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.renderer = this.experience.renderer
        this.debug = this.experience.debug

        this.parameters = {}
        this.parameters.count = 12000
        this.parameters.size = 300.0
        this.parameters.radius = 50 
        this.parameters.innerRadius = 0.05

        this.setPointsGeometry()
        this.setPointsMaterial()
        this.setPointsMesh()

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment')

            this.debugFolder.add(this.parameters, 'count').min(100).max(100000).step(100).onFinishChange(() => {
                this.setPointsGeometry()
                this.setPointsMesh()
            })
            this.debugFolder.add(this.parameters, 'size').min(0.1).max(300).step(0.1).onFinishChange(() => {
                this.setPointsMaterial()
                this.setPointsMesh()
            })
            this.debugFolder.add(this.parameters, 'radius').min(0.1).max(40).step(0.1).onFinishChange(() => {
                this.setPointsGeometry()
                this.setPointsMesh()
            })
            this.debugFolder.add(this.parameters, 'innerRadius').min(0.1).max(20).step(0.1).onFinishChange(() => {
                this.setPointsGeometry()
                this.setPointsMesh()
            })
        }
    }

    setPointsGeometry = () => {

        if(this.pointsGeometry !== undefined)
        {
            this.pointsGeometry.dispose()
        }

        this.pointsGeometry = new THREE.BufferGeometry()

        const positions = new Float32Array(this.parameters.count * 3)
        const scales = new Float32Array(this.parameters.count * 1)
        const randoms = new Float32Array(this.parameters.count * 3)

        for(let i = 0; i < this.parameters.count; i++)
        {
            const i3 = i * 3

            const phi = Math.random() * Math.PI * 2;
            const costheta = Math.random() * 2 - 1;
            const u = Math.random();

            const theta = Math.acos(costheta);
            const r = this.parameters.radius * Math.pow(u, this.parameters.innerRadius); 

            const x = r * Math.sin(theta) * Math.cos(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(theta);

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            scales[i] = Math.random()
        }

        this.pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        this.pointsGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
        this.pointsGeometry.setAttribute('aRandomness', new THREE.BufferAttribute(randoms, 3))
    }

    setPointsMaterial = () => {
            
        if(this.pointsMaterial !== undefined)
        {
            this.pointsMaterial.dispose()
        }

        this.pointsMaterial = new THREE.ShaderMaterial({
            depthWrite: false,
            blending: THREE.AdditiveBlending, 
            vertexShader,
            fragmentShader,
            uniforms: {
                uSize: { value: this.parameters.size },
            }
        })

    
    }

    setPointsMesh = () => {

        if(this.pointsMesh !== null)
        {
            this.scene.remove(this.pointsMesh)
        }

        this.pointsMesh = new THREE.Points(this.pointsGeometry, this.pointsMaterial)

        this.scene.add(this.pointsMesh)
    }

    update = () => {
        //do nothing
    }

}