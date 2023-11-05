const idPopup = 'popup-js'
const classNamePopup = 'popup'

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
  static instance = null

  /**
   * @param {Object.<string, function(): Promise<HTMLElement|null>|HTMLElement|null>} contentFunctionsMapper
   * @return {PopUp}
   */
  constructor(contentFunctionsMapper) {
    if (PopUp.instance) {
      return PopUp.instance
    }
    PopUp.instance = this
    this.contentFunctionsMapper = contentFunctionsMapper
    this.popup = null
    this.content = null
    this.initialize()
  }

  /**
   *
   * @return {PopUp}
   */
  close() {
    this.popup.style.display = 'none'
    this.popup.classList.remove('open')
    const closeEvent = new CustomEvent('popup:close', {detail: this.content})
    document.dispatchEvent(closeEvent)
    if (this.content && this.popup.contains(this.content)) {
      this.popup.removeChild(this.content)
    }
    return this
  }

  /**
   *
   * @return {PopUp}
   */
  open() {
    this.popup.style.display = 'flex'
    this.popup.classList.add('open')
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

  initialize() {
    this.popup = this.createPopUp()
    const popUpButtons = document.querySelectorAll(
      this.getSelectorsByContentFunctionsMapper()
    )
    popUpButtons.forEach(async (popUpButton) => {
      popUpButton.addEventListener('click', this.handler.bind(this))
    })
  }

  /**
   *
   * @param event
   * @return {Promise<void>}
   */
  async handler(event) {
    event.preventDefault()
    const popUpButton = event.target
    if (!popUpButton.popupContent) {
      popUpButton.popupContent = await this.fetchContent(popUpButton)
    }
    this.setContent(popUpButton.popupContent)
      .open()
  }

  /**
   *
   * @param popUpButton
   * @return {Promise<HTMLElement|null>}
   */
  async fetchContent(popUpButton) {
    try {
      const attributeName = Array.from(popUpButton.attributes)
        .map(attribute => attribute.name)
        .find(name => this.contentFunctionsMapper.hasOwnProperty(name))
      const attributeValue = popUpButton.getAttribute(attributeName)
      /**
       * @type {HTMLElement|null}
       */
      const content = await this.contentFunctionsMapper[attributeName](attributeValue, popUpButton, this)
      if (content) {
        content.classList.add(`${classNamePopup}__wrapper`, attributeName)
      }
      return content
    } catch (error) {
      console.error(error)
    }
  }


  /**
   * Create PopUp
   * @returns {HTMLElement}
   */
  createPopUp() {
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
    popup.classList.add(classNamePopup, `${classNamePopup}__overlay-Layer`)
    document.body.appendChild(popup)
    // window.addEventListener('resize', this.close.bind(this))
    popup.addEventListener('click', (e) => {
      if (e.target.id === idPopup) {
        this.close.call(this)
      }
    })
    return popup
  }

  /**
   *
   * @return {string}
   */
  getSelectorsByContentFunctionsMapper() {
    return '[' + Object.keys(this.contentFunctionsMapper).join('],[') + ']'
  }
}

export default PopUp
