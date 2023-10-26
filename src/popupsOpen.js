import popup from './inc/popup.js'
import youTubePlayer from './inc/youtube/youTubePlayer.js'

/**
 * The content of popUp windows must be on the page
 * in a block with an id specified in the 'data-popup-...' attribute
 * When you click on the button to open a popUp window,
 * the contents will be transferred to the popUp window
 *
 * Closing is done by clicking on the background or any element of the page
 * with the selector listed in the buttonCloseSelectors array
 */

const dataPopupOpenAttributesContentMapper = {
  'data-popup-open-youtube-video': youtubeVideo,
  'data-popup-open-target-by-id': targetById,
  'data-popup-open-target-by-url': fetchContentFromURL //for example
}

const buttonCloseSelectors = [
  '[data-contact-us-close]',
  '[data-popup-close]',
  '.popup__btn-close'
]

export default () => {
  const popUpButtons = document.querySelectorAll(
    '[' + Object.keys(dataPopupOpenAttributesContentMapper).join('],[') + ']'
  )
  const fetchContent = async (popUpButton) => {
    try {
      if (!popUpButton.popupContent) {
        popUpButton.popupContent = await getContent(popUpButton)
      }
      popup.setContent(popUpButton.popupContent).open()
    } catch (error) {
      console.error(error)
    }
  }

  popUpButtons.forEach(async (popUpButton) => {
    popUpButton.style.cursor = 'pointer'
    popUpButton.addEventListener('click', (e) => {
      e.preventDefault()
      fetchContent(popUpButton)
    })
  })

  // Closing popup
  const selectors = buttonCloseSelectors.join()
  function handleCloseEvent(e) {
    const target = e.target
    if (
      target.closest(selectors)
    ) {
      e.preventDefault()
      popup.close()
    }
  }
  document.addEventListener('click', handleCloseEvent)
}

/**
 * Factory method
 * Getting content
 *
 * @param popUpButton
 * @return {Promise<HTMLElement|DocumentFragment>|null}
 */
function getContent(popUpButton) {
  /**
   * 'data-popup-open-youtube-video', 'data-popup-open-target-by-id', ...
   * @type {string}
   */
  const attributeName = popUpButton.getAttributeNames()
    .find(item => dataPopupOpenAttributesContentMapper[item])
  if (!attributeName) return null
  /**
   * Value data-popup-...
   * @type {string}
   */
  const attributeValue = popUpButton.getAttribute(attributeName)
  if (!attributeValue) return null
  return new Promise(async (resolve, reject) => {
    try {
      /**
       * @type {HTMLElement|null}
       */
      const content = await dataPopupOpenAttributesContentMapper[attributeName](attributeValue)
      if(content) {
        content.classList.add('popup__wrapper', attributeValue, attributeName)
      }
      resolve(content)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Get the contents of an HTML element
 * whose id === targetId
 *
 * @param targetId
 * @returns {HTMLElement|null}
 */
function targetById(targetId) {

  const target = document.getElementById(targetId)
  const container = document.createElement('div')
  if (target instanceof HTMLTemplateElement) {
    container.appendChild(document.importNode(target.content, true))

  } else if (target instanceof HTMLElement) {
    const childNodes = target.cloneNode(true).childNodes
    while (childNodes.length > 0) {
      container.appendChild(childNodes[0])
    }
  } else {
    return null
  }
  return container
}


/**
 * Get youtube video player
 *
 * @param {String} videoId
 * @returns {HTMLElement|null}
 */
function youtubeVideo(videoId) {
  const containerId = 'player-' + videoId
  let videoContainer = document.getElementById(containerId)
  if (!videoContainer) {
    videoContainer = document.createElement('div')
    videoContainer.id = containerId
    videoContainer.classList.add('popup__video-player-wrapper')
    document.body.appendChild(videoContainer)
  }
  youTubePlayer(videoId, containerId)
  /**
   * @type {HTMLElement|null}
   */
  const player = document.getElementById(containerId)

  // Additional items
  const btnClose = document.createElement('div')
  btnClose.className = 'popup__btn-close btn btn--close btn--close-white'
  const container = document.createElement('div')
  container.appendChild(player)
  container.appendChild(btnClose)
  return container
}

/**
 * !!! For example only !!!
 * Example of an asynchronous function to retrieve content from a URL
 *
 * You can do the same for various APIs
 *
 * @param {string} url
 * @param {string} selector - on the page received from the URL
 * @return {Promise<HTMLElement|DocumentFragment>}
 */
function fetchContentFromURL(url, selector) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.text()
      })
      .then((content) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(content, 'text/html')
        const fetchContent = doc.querySelector(selector ?? 'body')
        resolve(fetchContent)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
