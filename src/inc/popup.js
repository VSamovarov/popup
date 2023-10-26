import overlayLayer from './overlayLayer.js'
const idPopup = 'popup-js'

/**
 * Mechanism for PopUp
 *
 * Usage example
 *
 * const new PopUp()
 * const popupContent = document.getElementById(targetId)
 * popup.setContent(popupContent).open()
 *
 * popup.close()
 *
 * Opening and closing a window triggers events on document
 * popup:close and popup:close respectively
 * in detail - link to popup contents {HTMLElement}
 */
class PopUp {
  constructor() {
    if (PopUp.instance) {
      return PopUp.instance
    }
    PopUp.instance = this
    this.popup = this.#createPopUp()
    this.overlayLayer = overlayLayer
    this.content = null
  }

  close() {
    this.popup.style.display = 'none'
    this.overlayLayer.close()
    this.popup.classList.remove('open')
    const closeEvent = new CustomEvent('popup:close', {detail: this.content})
    document.dispatchEvent(closeEvent)
    if (this.content && this.popup.contains(this.content)) {
      this.popup.removeChild(this.content)
    }
    return this
  }

  open() {
    this.popup.style.display = 'flex'
    this.popup.classList.add('open')
    this.overlayLayer.open()
    const openEvent = new CustomEvent('popup:open', {detail: this.content})
    document.dispatchEvent(openEvent)
    return this
  }

  /**
   * Inserting content
   * @param {HTMLElement|null} content
   * @returns {PopUp}
   */
  setContent(content) {
    this.content = content
    if (content) {
      this.popup.appendChild(this.content)
    }
    return this
  }

  /**
   * Create PopUp
   * @returns {HTMLElement}
   */
  #createPopUp() {
    const popup = document.createElement('div')
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      display: none;
      width: 100vw;
      height: 100vh;
      align-items:center;
      justify-content: center;
      `
    popup.id = idPopup
    popup.classList.add('popup')
    document.body.appendChild(popup)
    // window.addEventListener('resize', this.close.bind(this))
    document.addEventListener('clickOverlay', this.close.bind(this))
    popup.addEventListener('click', (e) => {
      if(e.target.id === idPopup) {
        this.close.call(this)
      }
    })
    return popup
  }
}

export default new PopUp()
