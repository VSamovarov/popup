/**
 * Returns content from a block with a specific ID
 * Cloning occurs, so all events are lost
 *
 * @param targetId
 * @return {HTMLDivElement}
 */
export default function (targetId) {
  const wrapper = document.getElementById(targetId)
  const childNodes = wrapper.cloneNode(true).childNodes
  const container = document.createElement('div')
  while (childNodes.length > 0) {
    container.appendChild(childNodes[0])
  }
  return container
}