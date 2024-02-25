import * as THREE from 'three'
import vertexShader from '../shaders/wavySphere/vertex.glsl'
import fragmentShader from '../shaders/wavySphere/fragment.glsl'
import Experience from '../../Experience'
import gsap from 'gsap'

export default class WavySphere {

    constructor(params) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug 

        this.params = params
        this.position = this.params.position
        this.size = this.params.size
        this.params.speed = this.params.speed || 0.0003
        this.left = false
        this.rotation = {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
            z: Math.random() - 0.5 
        }

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('WavySphere')
            this.debugFolder.add(this.params, 'speed').step(0.0001).min(0).max(0.01)
            this.debugFolder.add(this.params, 'size').step(0.0001).min(0).max(1).onChange(() => {
                this.setGeometry()
                this.setMesh()
            })
            this.debugFolder.addColor(this.params, 'insideColor').onChange(() => {
                this.setMaterial()
                this.setMesh()
            })
            this.debugFolder.addColor(this.params, 'outsideColor').onChange(() => {
                this.setMaterial()
                this.setMesh()
            })
            this.debugFolder.add(this.params, 'colorSteepness').step(0.01).min(0).max(20).onChange(() => {
                this.setMaterial()
                this.setMesh()
            })
            this.debugFolder.add(this.params, 'amplitude').step(0.01).min(0).max(1).onChange(() => {
                this.setMaterial()
                this.setMesh()
            })
            this.debugFolder.add(this.params, 'frequency').step(0.01).min(0).max(1000).onChange(() => {
                this.setMaterial()
                this.setMesh()
            })
            this.debugFolder.add(this.params.displacementSkew, 'x').step(0.01).min(0).max(1).name("perlinX").onChange(() => {
                this.setMaterial()
                this.setMesh()
            })
            this.debugFolder.add(this.params.displacementSkew, 'y').step(0.01).min(0).max(1).name("perlinY").onChange(() => {
                this.setMaterial()
                this.setMesh()
            })
            this.debugFolder.add(this.params.displacementSkew, 'z').step(0.01).min(0).max(1).name("perlinZ").onChange(() => {
                this.setMaterial()
                this.setMesh()
            })
            this.debugFolder.add(this.params, 'noise').onFinishChange(() => {
                this.setMaterial()
                this.setMesh()
            })
        }
    }

    setGeometry() {
        if (this.geometry) {
            this.geometry.dispose()
        }
        this.geometry = new THREE.SphereGeometry( this.size, 500, 500 )
    }

    setMaterial() {
        if (this.material) {
            this.material.dispose()
        }
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uInsideColor: { value: new THREE.Color(this.params.insideColor) },
                uOutsideColor: { value: new THREE.Color(this.params.outsideColor) },
                uColorSteepness: { value: this.params.colorSteepness },
                uAmplitude: { value: this.params.amplitude},
                uFrequency: { value: this.params.frequency },
                uDisplacementSkew: { value: this.params.displacementSkew },
                uNoise: { value: this.params.noise },
                uFbm: { value: this.params.fbm }
            },
            vertexShader,
            fragmentShader,
        })
    }

    setMesh() {
        if (this.mesh) {
            this.scene.remove(this.mesh)
        }
        this.mesh = new THREE.Mesh( this.geometry, this.material )
        this.mesh.position.set(this.position.x, this.position.y, this.position.z)
        this.mesh.name = this.params.title
        this.scene.add(this.mesh)
    }

    update() {
        this.material.uniforms.uTime.value = this.time.elapsed * this.params.speed
    
        this.mesh.rotation.y = this.time.elapsed * 0.0006 * this.rotation.y
        this.mesh.rotation.x = this.time.elapsed * 0.0006 * this.rotation.x
        this.mesh.rotation.z = this.time.elapsed * 0.0006 * this.rotation.z

    }

    updateParams(params) {
        gsap.to(this.params, {
            ease: 'power3.inOut',
            duration: 10,
            ...params,
            onUpdate: () => {
                if ('amplitude' in params || 'frequency' in params) {
                    this.material.uniforms.uAmplitude.value = this.params.amplitude;
                    this.material.uniforms.uFrequency.value = this.params.frequency;
                }

            }
        });
        // Animate color parameters separately to ensure smooth transitions
        if ('insideColor' in params) {
            // Use GSAP's color interpolation
            gsap.to(this.material.uniforms.uInsideColor.value, {
                ease: 'power3.inOut',
                duration: 10,
                r: new THREE.Color(params.insideColor).r,
                g: new THREE.Color(params.insideColor).g,
                b: new THREE.Color(params.insideColor).b
            });
        }

        if ('outsideColor' in params) {
            gsap.to(this.material.uniforms.uOutsideColor.value, {
                ease: 'power3.inOut',
                duration: 10,
                r: new THREE.Color(params.outsideColor).r,
                g: new THREE.Color(params.outsideColor).g,
                b: new THREE.Color(params.outsideColor).b
            });
        }

        if ('colorSteepness' in params) {
            gsap.to(this.material.uniforms.uColorSteepness, {
                ease: 'power3.inOut',
                duration: 10,
                value: params.colorSteepness
            });
        }
    }

    animateSlide() {
        if(this.left) {
            gsap.to(this.mesh.position, {
                duration: 1,
                x: 0,
                ease: 'power3.inOut'
            })
        } else {
            gsap.to(this.mesh.position, {
                duration: 1,
                x: -0.8,
                ease: 'power3.inOut'
            })
        }
        this.left = !this.left
   }
}