import * as THREE from "three"
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from "/shaders/fragment.glsl"
import vertex from "/shaders/vertex.glsl"

import * as dat from "dat.gui"

import DisplacementImage from "../images/displacement.png"
import HumanImage from "../images/human.jpg"

export default class Sketch {
    constructor() {
        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer()
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.width, this.height)
        this.renderer.setClearColor(0x000000, 1)

        this.container = document.getElementById("container")
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.container.appendChild(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        )

        this.camera.position.set(0, 0, 2)

        this.time = 0

        this.paused = false

        this.setupResize()

        this.addObjects()
        this.resize()
        this.render()
        this.settings()
    }

    settings() {
        let that = this
        this.settings = {
            progress: 0,
        }
        this.gui = new dat.GUI()
        this.gui.add(this.settings, "progress", 0, 1, 0.01)
    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this))
    }

    resize() {
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.renderer.setSize(this.width, this.height)
        this.camera.aspect = this.width / this.height

        this.imageAspect = 853 / 1280
        let a1
        let a2
        if (this.height / this.width > this.imageAspect) {
            a1 = (this.width / this.height) * this.imageAspect
            a2 = 1
        } else {
            a1 = 1
            a2 = this.height / this.width / this.imageAspect
        }

        this.material.uniforms.resolution.value.x = this.width
        this.material.uniforms.resolution.value.y = this.height
        this.material.uniforms.resolution.value.z = a1
        this.material.uniforms.resolution.value.w = a2

        this.camera.updateProjectionMatrix()
    }

    addObjects() {
        let that = this
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable",
            },

            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                progress: { type: "f", value: 0 },
                image: {
                    type: "t",
                    value: new THREE.TextureLoader().load(HumanImage),
                },

                displacement: {
                    type: "t",
                    value: new THREE.TextureLoader().load(DisplacementImage),
                },

                resolution: { type: "v4", value: new THREE.Vector4() },
                uvRate1: {
                    value: new THREE.Vector2(1, 1),
                },
            },

            vertexShader: vertex,
            fragmentShader: fragment,
        })

        this.geometry = new THREE.PlaneGeometry(1, 1.2, 1, 1)

        geo

        this.plane = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.plane)
    }

    stop() {
        this.paused = true
    }

    play() {
        this.paused = false
        this.render()
    }

    render() {
        if (this.paused) return
        this.time += 0.05
        this.material.uniforms.time.value = this.time
        this.material.uniforms.progress.value = this.settings.progress
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
}

new Sketch("container")
