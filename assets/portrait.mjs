// A shallow, photo-aligned surface: the original JPEG is never modified.
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = (a, b, value) => {
  const t = clamp((value - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const headOutline = [
  [.505, -.05], [.81, -.05], [.895, .008], [.932, .09], [.932, .20],
  [.918, .30], [.917, .385], [.89, .406], [.858, .419], [.828, .492],
  [.774, .559], [.699, .600], [.621, .590], [.557, .554], [.509, .493],
  [.475, .412], [.45, .394], [.441, .35], [.45, .287], [.427, .238],
  [.426, .16], [.441, .093], [.469, .039]
];
const bodyOutline = [
  [.025, 1.04], [.04, .87], [.07, .81], [.14, .77], [.27, .72],
  [.36, .66], [.46, .60], [.52, .55], [.63, .59], [.81, .56],
  [.87, .65], [.96, .70], [1.04, .76], [1.04, 1.04]
];
function insideDistance(x, y, outline) {
  let inside = false, distance = Infinity;
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
    const [ax, ay] = outline[j], [bx, by] = outline[i];
    const dx = bx - ax, dy = by - ay;
    const t = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy));
    distance = Math.min(distance, Math.hypot(x - ax - t * dx, y - ay - t * dy));
    if ((ay > y) !== (by > y) && x < ax + (y - ay) * dx / dy) inside = !inside;
  }
  return inside ? distance : -distance;
}
export function portraitSurface(x, y) {
  const edge = smooth(0, .025, Math.min(x, 1 - x, y, 1 - y));
  const face = smooth(-.018, .016, insideDistance(x, y, headOutline));
  const neck = (1 - smooth(.55, .79, y)) * smooth(.47, .55, y)
    * (1 - smooth(.105, .155, Math.abs(x - .675)));
  const head = Math.max(face, neck) * edge;
  const body = smooth(-.012, .035, insideDistance(x, y, bodyOutline))
    * smooth(.47, .68, y) * edge;
  const round = Math.sqrt(Math.max(0, 1 - ((x - .67) / .25) ** 2 - ((y - .30) / .34) ** 2));
  const nose = Math.exp(-(((x - .613) / .055) ** 2 + ((y - .355) / .07) ** 2));
  return { head, body, depth: head * (.16 * round + .085 * nose) };
}

// 4.6 seconds of motion, surrounded by stillness. Every movement returns exactly home.
export const PORTRAIT_TIMING = Object.freeze({ cycle: 15000, start: 1800, duration: 4600 });
export function portraitPose(time) {
  const { cycle, start, duration } = PORTRAIT_TIMING;
  const clock = Math.max(0, time) % cycle;
  if (clock < start || clock >= start + duration) {
    return { yaw: 0, pitch: 0, roll: 0, breath: 0, moving: false,
      wait: clock < start ? start - clock : cycle - clock + start };
  }
  const phase = (clock - start) / duration;
  const gesture = smooth(0, .38, phase) * (1 - smooth(.60, 1, phase));
  const direction = [1, -.65, .8][Math.floor(Math.max(0, time) / cycle) % 3];
  return {
    yaw: .021 * gesture * direction,
    pitch: -.008 * gesture,
    roll: -.0045 * gesture * direction,
    breath: .0020 * Math.sin(Math.PI * phase) ** 2,
    moving: true, wait: 0
  };
}

export async function createLivingPortrait(figure, { autoplay = true, remember = true } = {}) {
  const image = figure.querySelector('img');
  const button = figure.querySelector('.portrait-toggle');
  await image.decode();
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!context) throw new Error('WebGL 2 unavailable');
  const THREE = await import('./vendor/three-r180/three.module.min.js');
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: false, antialias: false });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, .1, 10);
  camera.position.z = 2;
  const geometry = new THREE.PlaneGeometry(1, 1, 128, 128);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const weights = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i++) {
    const surface = portraitSurface(uv.getX(i), 1 - uv.getY(i));
    position.setZ(i, surface.depth);
    weights[i * 2] = surface.head;
    weights[i * 2 + 1] = surface.body;
  }
  geometry.setAttribute('aMotion', new THREE.BufferAttribute(weights, 2));
  const texture = new THREE.Texture(image);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  const uniforms = {
    portrait: { value: texture },
    pose: { value: new THREE.Vector4() }
  };
  const material = new THREE.ShaderMaterial({
    uniforms, toneMapped: false,
    vertexShader: `
      attribute vec2 aMotion;
      uniform vec4 pose;
      varying vec2 imageUV;
      void main() {
        imageUV = uv;
        vec3 pivot = vec3(.175, -.215, 0.0);
        vec3 p = position - pivot;
        float cy = cos(pose.x), sy = sin(pose.x);
        float cp = cos(pose.y), sp = sin(pose.y);
        float cr = cos(pose.z), sr = sin(pose.z);
        p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
        p = vec3(p.x, cp * p.y - sp * p.z, sp * p.y + cp * p.z);
        p = vec3(cr * p.x - sr * p.y, sr * p.x + cr * p.y, p.z);
        vec3 moved = mix(position, p + pivot, aMotion.x);
        moved.y += pose.w * (aMotion.y + .20 * aMotion.x);
        moved.x += pose.w * (uv.x - .65) * .65 * aMotion.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(moved, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D portrait;
      varying vec2 imageUV;
      void main() {
        gl_FragColor = texture2D(portrait, imageUV);
        #include <colorspace_fragment>
      }
    `
  });
  scene.add(new THREE.Mesh(geometry, material));
  canvas.className = 'portrait-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  let disposed = false, elapsed = 0, lastClock = 0, lastDraw = -Infinity;
  let raf = 0, timer = 0, visible = true, running = false;
  let paused = !autoplay;
  if (remember) {
    try { paused ||= localStorage.getItem('pk-portrait-paused') === 'true'; } catch (_) {}
  }
  const draw = pose => {
    uniforms.pose.value.set(pose.yaw, pose.pitch, pose.roll, pose.breath);
    renderer.render(scene, camera);
  };
  const stop = () => {
    if (running) elapsed += performance.now() - lastClock;
    running = false;
    cancelAnimationFrame(raf);
    clearTimeout(timer);
  };
  const updateButton = () => {
    if (!button) return;
    const label = paused ? button.dataset.playLabel : button.dataset.pauseLabel;
    button.setAttribute('aria-label', label);
    button.title = label;
    button.dataset.paused = String(paused);
  };
  const frame = now => {
    if (!running || disposed) return;
    elapsed += now - lastClock;
    lastClock = now;
    const pose = portraitPose(elapsed);
    figure.dataset.portraitMotion = pose.moving ? 'moving' : 'rest';
    if (!pose.moving || now - lastDraw >= 1000 / 30) {
      draw(pose);
      lastDraw = now;
    }
    if (pose.moving) raf = requestAnimationFrame(frame);
    else timer = setTimeout(() => frame(performance.now()), Math.max(1, pose.wait));
  };
  const sync = () => {
    stop();
    updateButton();
    if (disposed) return;
    figure.dataset.portraitMotion = paused ? 'paused' : 'rest';
    if (paused || !visible || document.hidden) return;
    running = true;
    lastClock = performance.now();
    frame(lastClock);
  };
  const toggle = () => {
    paused = !paused;
    if (remember) {
      try { localStorage.setItem('pk-portrait-paused', String(paused)); } catch (_) {}
    }
    sync();
  };
  const resize = () => {
    const { width, height } = figure.getBoundingClientRect();
    if (!width || !height || disposed) return;
    const ratio = width / height;
    const halfWidth = Math.min(1, ratio) * .5;
    const halfHeight = Math.min(1, 1 / ratio) * .5;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2, 1200 / Math.max(width, height)));
    renderer.setSize(width, height, false);
    draw(portraitPose(elapsed));
  };
  const resizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  });
  function dispose() {
    if (disposed) return;
    stop();
    disposed = true;
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', sync);
    button?.removeEventListener('click', toggle);
    canvas.removeEventListener('webglcontextlost', lost);
    canvas.remove();
    figure.classList.remove('has-living-portrait');
    figure.dataset.portraitMotion = 'static';
    if (button) button.hidden = true;
    geometry.dispose();
    material.dispose();
    texture.dispose();
    renderer.dispose();
  }
  const lost = event => { event.preventDefault(); dispose(); };
  try {
    let shaderFailed = false;
    renderer.debug.onShaderError = () => { shaderFailed = true; };
    renderer.compile(scene, camera);
    if (shaderFailed) throw new Error('Portrait shader unavailable');
    resize();
    figure.append(canvas);
    figure.classList.add('has-living-portrait');
    if (button) button.hidden = false;
    resizeObserver.observe(figure);
    visibilityObserver.observe(figure);
    document.addEventListener('visibilitychange', sync);
    button?.addEventListener('click', toggle);
    canvas.addEventListener('webglcontextlost', lost);
    sync();
  } catch (error) { dispose(); throw error; }
  return {
    dispose,
    // Deterministic pose selection for the standalone development preview.
    renderAt(time) { paused = true; stop(); elapsed = time; draw(portraitPose(time)); updateButton(); }
  };
}

if (typeof document !== 'undefined') {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-living-portrait]').forEach(figure => {
    let controller, generation = 0, nearViewport = false, pending = Promise.resolve();
    const apply = () => {
      const current = ++generation;
      controller?.dispose();
      controller = undefined;
      // Serialize initialization so a late import cannot dispose a newer canvas.
      pending = pending.then(async () => {
        if (current !== generation || reducedMotion.matches || !nearViewport) return;
        try {
          const next = await createLivingPortrait(figure);
          if (current !== generation) next.dispose();
          else controller = next;
        } catch (_) {
          if (current === generation) figure.dataset.portraitMotion = 'static';
        }
      });
    };
    const lazy = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      nearViewport = true;
      lazy.disconnect();
      apply();
    }, { rootMargin: '150px' });
    lazy.observe(figure);
    reducedMotion.addEventListener('change', apply);
  });
}
