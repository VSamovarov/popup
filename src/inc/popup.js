const idPopup = 'popup-js'
const classNamePopup = 'popup'

/**
 * Mechanism for PopUp
 */
class PopUp {
  static instance = null
  /**
   * @param {Object.<string,
   *   function(attributeValue: string, popUpButton: HTMLElement, context: this):
   *   Promise<HTMLElement|null>|HTMLElement|null>} contentFunctionsMapper
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
   * Open PopUp
   *
   * @return {PopUp}
   */
  close() {
    this.popup.style.display = 'none'
    this.popup.classList.remove('open')
    this.addEvent('popup:close')
    if (this.content && this.popup.contains(this.content)) {
      this.popup.removeChild(this.content)
    }
    return this
  }

  /**
   * Close PopUp
   *
   * @return {PopUp}
   */
  open() {
    this.popup.style.display = 'flex'
    this.popup.classList.add('open')
    this.addEvent('popup:open')
    return this
  }

  /**
   * Inserting content
   *
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
   * handler opens a PopUp when a button is clicked
   *
   * @param event
   * @return {Promise<void>}
   */
  async handler(event) {
    event.preventDefault()
    const popUpButton = event.target
    this.addEvent('popup:startFetchContent')
    try {
      if (!popUpButton.popupContent) {
        popUpButton.popupContent = await this.fetchContent(popUpButton)
      }
      this.addEvent('popup:endFetchContent')
      this.setContent(popUpButton.popupContent)
        .open()
    } catch (error) {
      this.addEvent('popup:errorFetchContent', {error})
      console.error(error)
    }
  }

  /**
   * Factory method.
   * Receiving content for PopUp
   *
   * @param popUpButton
   * @return {Promise<HTMLElement|null>}
   */
  async fetchContent(popUpButton) {
    /**
     * We are looking for the first attribute of the popUpButton element,
     * which matches the name of one of the contentFunctionsMapper attributes.
     * Returns the name of only one matched attribute. The rest - ignores
     *
     * @type {string|null}
     */
    const attributeName = Array.from(popUpButton.attributes)
      .map(attribute => attribute.name)
      .find(name => this.contentFunctionsMapper.hasOwnProperty(name))

    if (!attributeName) return null
    const attributeValue = popUpButton.getAttribute(attributeName)
    /**
     * @type {function( attributeValue: string, popUpButton: HTMLElement, context: this): (Promise<HTMLElement|null>|HTMLElement|null)}
     */
    const contentMethod = this.contentFunctionsMapper[attributeName]
    if (!contentMethod) return null
    /**
     * @type {HTMLElement|null}
     */
    const content = await contentMethod(attributeValue, popUpButton, this)
    if (content) {
      content.classList.add(`${classNamePopup}__wrapper`, attributeName)
    }
    return content
  }

  /**
   * Create PopUp
   *
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
   * Create a selector to select all buttons that open PopUp
   *
   * @return {string}
   */
  getSelectorsByContentFunctionsMapper() {
    return '[' + Object.keys(this.contentFunctionsMapper).join('],[') + ']'
  }

  /**
   * Helper for creating an event
   *
   * @param {string} name
   * @param {Object|null} addDetail
   */
  addEvent(name, addDetail = null) {
    const detail = Object.assign({}, {popup: this}, addDetail)
    const event = new CustomEvent(name, {detail})
    document.dispatchEvent(event)
  }
}

export default PopUp
