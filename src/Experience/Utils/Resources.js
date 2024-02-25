import EventEmitter from "./EventEmitter";
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class Resources extends EventEmitter {

    constructor(sources) {
        super()

        // Options
        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        if (this.toLoad == 0) {
            this.trigger('ready')
        } else {
            this.startLoading()
        }
    }

    setLoaders() {

        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()

    }

    startLoading() {
        //Load each source
        this.sources.forEach((source) => {
            switch (source.type){
                case ('gltfModel'):
                    this.loaders.gltfLoader.load(
                        source.path,
                        (file) => {
                            this.sourceLoaded(source, file)
                        }
                    )
                    break
                case ('texture'):
                    this.loaders.textureLoader.load(
                        source.path,
                        (file) => {
                            this.sourceLoaded(source, file)
                        }
                    )
                    break
                case ('cubeTexture'):
                    this.loaders.cubeTextureLoader.load(
                        source.path,
                        (file) => {
                            this.sourceLoaded(source, file)
                        }
                    )
                    break
                default:
                    console.error(`${source.type} file type not yet supported.`)
            }
        })
    }

    sourceLoaded (source, file){

        this.items[source.name] = file

        this.loaded++

        if (this.loaded == this.toLoad ) {
            this.trigger('ready')
        }
        
    }
}