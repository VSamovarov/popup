import PopUp from './inc/popup.js'
import targetById from './inc/contents/targetById.js'
import fetchContentFromURL from './inc/contents/fetchContentFromURL.js'


const contentFunctionsMapper = {
  'data-popup-open-target-by-id': targetById,
  'data-popup-open-target-by-url': fetchContentFromURL
}

new PopUp(contentFunctionsMapper)
