import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { gsap } from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

 // ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
    /**
    *GUI
    */
    // import *as dat from 'dat.gui'
    // const gui = new dat.GUI()

    /**
     * Base
     */
    //Canvas
    const canvas = document.querySelector('canvas.webgl')

    //Scene
    const scene = new THREE.Scene()

    // ライトを作成(（平行光源)
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1);

    // ライトをシーンに追加
    scene.add(directionalLight)

    /**
     * Object
     */
    const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 )
    // const material = new THREE.MeshNormalMaterial()
    const material = new THREE.MeshToonMaterial({ color: 0x6699FF });

    //Material Props
    // material.wireframe = true

    //Create Mesh & Add To scene
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)


    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    }

    window.addEventListener('resize', () => {
        // Save sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     * Environnements
     */

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.001,
        5000
    )
    camera.position.x = 1
    camera.position.y = 1
    camera.position.z = 40
    scene.add(camera)

    //Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.enabled = true
    controls.autoRotate = true
    // controls.enableZoom = false
    controls.enablePan = false
    controls.dampingFactor = 0.05
    controls.maxDistance = 700///ズームできる最大遠距離
    controls.minDistance = 10///ズームできる最大近距離

    // // Test
    // const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshNormalMaterial())
    // scene.add(cube)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('.webgl'),
        antialias: true,
        alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(sizes.width, sizes.height)

    /**
     * GSAP Animation
     */
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.defaults({
        scrub: 3,
        ease: 'none',
    })
    const sections = document.querySelectorAll('.section')
    gsap.from(mesh.position, {
        y: 1,
        duration: 1,
        ease: 'expo',
    })

    //h1の表示アニメーション
    gsap.from('h1', {
        yPercent: 100,
        autoAlpha: 0,
        ease: 'back',
        delay: 0.3,
    })

    //section1>2のアニメーション
    gsap.to(mesh.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 1,
        scrollTrigger: {
            trigger: sections[1],
        },
    })

    //section2>3のア二メーション
    gsap.to(mesh.scale, {
        x: 2,
        y: 2,
        scrollTrigger: {
            trigger: sections[2]
        },
    })

    //section3>4のア二メーション
    gsap.to(mesh.rotation, {
        y: Math.PI * 3,
        scrollTrigger: {
            trigger: sections[3]
        },
    })


    /**
     * tick
     */
    const clock = new THREE.Clock()
    const tick = () => {
        const elapsedTime = clock.getElapsedTime()

        //mesh.rotation.x += 0.01 * Math.sin(1)
        //mesh.rotation.y += 0.01 * Math.sin(1)
        mesh.rotation.z += 0.01 * Math.sin(1)


        // Update
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Keep ticking
        window.requestAnimationFrame(tick)
    }
    /**
     * Mouse Move
     */

    function onMouseMove(e) {
        const x = e.clientX
        const y = e.clientY

        gsap.to(scene.rotation, {
            y: gsap.utils.mapRange(0, window.innerWidth, 1, -1, x),
            x: gsap.utils.mapRange(0, window.innerHeight, 1, -1, y),
        })
    }
    window.addEventListener('mousemove', onMouseMove)

    tick()

}
