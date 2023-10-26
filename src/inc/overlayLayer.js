/**
 * Overlay Layer
 *
 * const overlayLayer = new OverlayLayer()
 *
 * overlayLayer.open() - show
 * overlayLayer.close() - hidden
 *
 * When you click on the overlayLayer, we generate the 'clickOverlay' event
 * Somewhere further in the code, we listen to the clickOverlay event
 * and perform the appropriate actions
 *
 * document.addEventListener('clickOverlay', function(e) {
 *   // Your code that is executed when the overlay is clicked
 * })
 */

class OverlayLayer {
  constructor() {
    if (OverlayLayer.instance) {
      return OverlayLayer.instance
    }
    OverlayLayer.instance = this
    this.overlayLayer = this.#createOverlayLayer()
  }

  /**
   * Close
   * @returns {OverlayLayer}
   */
  close() {
    this.overlayLayer.style.display = 'none'
    document.body.style.overflow = 'auto'
    document.body.style.marginRight = '0'
    return this
  }

  /**
   * Open
   * @returns {OverlayLayer}
   */
  open() {
    this.overlayLayer.style.display = 'block'
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.marginRight = scrollBarWidth + 'px';
    return this
  }

  /**
   * Create Overlay Layer
   * @returns {HTMLElement}
   */
  #createOverlayLayer() {
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      background: rgba(17, 31, 43, 0.6);
      z-index: 500;
      display: none;
    `
    overlay.id = 'overlay-layer-js'
    // Add a click event handler to the overlay element
    overlay.addEventListener('click', (e) => {
      // When you click on a layer, we generate a clickOverlay event
      const clickOutsideEvent = new CustomEvent('clickOverlay',{detail: this})
      document.dispatchEvent(clickOutsideEvent)
    })
    document.body.appendChild(overlay)
    return overlay
  }
}

export default new OverlayLayer()
