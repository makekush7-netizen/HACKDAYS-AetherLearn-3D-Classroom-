import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

interface ClassroomProps {
  isPlaying?: boolean
  onLoaded?: () => void
  slideContent?: {
    title: string
    bullets: string[]
  }
}

export function Classroom({ isPlaying = false, onLoaded, slideContent }: ClassroomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    mixer: THREE.AnimationMixer | null
    animations: Record<string, THREE.AnimationAction>
    clock: THREE.Clock
    animationId: number | null
    whiteboard: THREE.Mesh | null
  } | null>(null)

  // Create slide texture from content
  const createSlideTexture = useCallback((title: string, bullets: string[]) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 576
    const ctx = canvas.getContext('2d')!
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1024, 576)
    gradient.addColorStop(0, '#1e1b4b')
    gradient.addColorStop(1, '#312e81')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 576)
    
    // Border
    ctx.strokeStyle = '#4338ca'
    ctx.lineWidth = 4
    ctx.strokeRect(20, 20, 984, 536)
    
    // Title background
    ctx.fillStyle = 'rgba(67, 56, 202, 0.3)'
    ctx.fillRect(40, 40, 944, 80)
    
    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(title.substring(0, 40), 512, 95)
    
    // Bullets
    ctx.textAlign = 'left'
    ctx.font = '24px Arial'
    let y = 180
    bullets.slice(0, 5).forEach((bullet) => {
      // Bullet point
      ctx.fillStyle = '#818cf8'
      ctx.beginPath()
      ctx.arc(70, y + 8, 8, 0, Math.PI * 2)
      ctx.fill()
      
      // Text
      ctx.fillStyle = '#e0e0e0'
      const text = bullet.length > 50 ? bullet.substring(0, 50) + '...' : bullet
      ctx.fillText(text, 95, y + 15)
      y += 60
    })
    
    // Footer
    ctx.fillStyle = '#6366f1'
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('AetherLearn AI', 512, 540)
    
    return new THREE.CanvasTexture(canvas)
  }, [])

  // Update whiteboard when slide changes
  useEffect(() => {
    if (sceneRef.current?.whiteboard && slideContent) {
      const texture = createSlideTexture(slideContent.title, slideContent.bullets)
      const material = sceneRef.current.whiteboard.material as THREE.MeshBasicMaterial
      if (material.map) material.map.dispose()
      material.map = texture
      material.needsUpdate = true
    }
  }, [slideContent, createSlideTexture])

  // Play talking animation when playing
  useEffect(() => {
    if (!sceneRef.current?.animations) return
    
    const animations = sceneRef.current.animations
    const animNames = Object.keys(animations)
    
    if (animNames.length === 0) return
    
    // Find speaking animation - exact name is 'speaking.001'
    const activeAnim = animNames.find(n => n === 'speaking.001') ||
      animNames.find(n => n.toLowerCase().includes('speaking')) ||
      animNames.find(n => n.toLowerCase().includes('talk'))
    
    // Find best idle animation (prefer breathing for natural look)
    const breathingIdle = animNames.find(n => n.toLowerCase().includes('breathing'))
    const regularIdle = animNames.find(n => n === 'Idle' || n.toLowerCase() === 'idle')
    const idleAnim = breathingIdle || regularIdle || animNames[0]
    
    console.log('Animation switch - isPlaying:', isPlaying)
    console.log('  Active animation:', activeAnim)
    console.log('  Idle animation:', idleAnim)
    
    // Fade out all current animations
    Object.values(animations).forEach(a => a.fadeOut(0.5))
    
    if (isPlaying && activeAnim) {
      // Play pointing/talking animation when speaking
      animations[activeAnim].reset().fadeIn(0.5).play()
      console.log('→ Now playing:', activeAnim)
    } else if (idleAnim) {
      // Play idle animation when not speaking
      animations[idleAnim].reset().fadeIn(0.5).play()
      console.log('→ Now playing:', idleAnim)
    }
  }, [isPlaying])

  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 800
    const height = container.clientHeight || 600

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)

    // Camera - exact settings from original
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
    camera.position.set(-0.8, 1.7, 0)
    camera.lookAt(-20, -0.6, -0.6)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(15, 20, 15)
    scene.add(directionalLight)

    const clock = new THREE.Clock()

    sceneRef.current = {
      scene,
      camera,
      renderer,
      mixer: null,
      animations: {},
      clock,
      animationId: null,
      whiteboard: null
    }

    const loader = new GLTFLoader()

    // Load classroom
    loader.load(
      '/models/basic_classroom.glb',
      (gltf) => {
        console.log('✓ Classroom loaded')
        gltf.scene.scale.set(1, 1, 1)
        scene.add(gltf.scene)

        // Whiteboard for slides
        const screenWidth = 2.4
        const screenHeight = screenWidth * (9 / 16)
        const geometry = new THREE.PlaneGeometry(screenWidth, screenHeight)
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide
        })
        const whiteboard = new THREE.Mesh(geometry, material)
        whiteboard.position.set(-2.3, 1.7, 0)
        whiteboard.rotation.y = Math.PI / 2
        scene.add(whiteboard)
        
        if (sceneRef.current) {
          sceneRef.current.whiteboard = whiteboard
          // Set initial slide
          if (slideContent) {
            const texture = createSlideTexture(slideContent.title, slideContent.bullets)
            material.map = texture
            material.needsUpdate = true
          }
        }
      },
      undefined,
      (err) => console.error('Classroom load error:', err)
    )

    // Load lecturer
    loader.load(
      '/models/lecturer.glb',
      (gltf) => {
        console.log('✓ Lecturer loaded')
        const lecturer = gltf.scene
        lecturer.scale.set(1.1, 1.1, 1.1)
        lecturer.position.set(-2.0, 0, -1.2)
        lecturer.rotation.y = Math.PI / 3
        scene.add(lecturer)

        if (gltf.animations.length > 0 && sceneRef.current) {
          const mixer = new THREE.AnimationMixer(lecturer)
          sceneRef.current.mixer = mixer

          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip)
            sceneRef.current!.animations[clip.name] = action
            console.log(`  Animation found: "${clip.name}" (${clip.duration.toFixed(2)}s)`)
          })

          // Find the best idle animation - prefer "Breathing Idle" for natural movement
          const animNames = Object.keys(sceneRef.current.animations)
          const breathingIdle = animNames.find(n => n.toLowerCase().includes('breathing'))
          const regularIdle = animNames.find(n => n === 'Idle' || n.toLowerCase() === 'idle')
          const bestIdle = breathingIdle || regularIdle || animNames[0]
          
          if (bestIdle) {
            console.log('✓ Playing default animation:', bestIdle)
            sceneRef.current.animations[bestIdle].play()
          }
          
          console.log('✓ All animations:', animNames)
        }
        
        onLoaded?.()
      },
      undefined,
      (err) => console.error('Lecturer load error:', err)
    )

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return
      sceneRef.current.animationId = requestAnimationFrame(animate)
      
      const delta = clock.getDelta()
      sceneRef.current.mixer?.update(delta)
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!container || !sceneRef.current) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0) {
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      sceneRef.current = null
    }
  }, [onLoaded, createSlideTexture, slideContent])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-gray-900 rounded-xl overflow-hidden"
    />
  )
}
