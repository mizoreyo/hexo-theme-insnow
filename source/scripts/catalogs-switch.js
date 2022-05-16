var isCataLogsOpen = false
var isOnclickReg = false

function switchCatalogs() {
  if (isCataLogsOpen === false) {
    document.getElementsByClassName('toc-container')[0].setAttribute('style', `height: ${document.getElementsByClassName('toc-container')[0].dataset.wholeHeight}`)
    isCataLogsOpen = true
  } else {
    document.getElementsByClassName('toc-container')[0].setAttribute('style', 'height: 0')
    isCataLogsOpen = false
  }

  if (isOnclickReg === false) {
    for (i = 0; i < document.getElementsByClassName('toc-text').length; i++) {
      document.getElementsByClassName('toc-text')[i].onclick = switchCatalogs
    }
    isOnclickReg = true
  }

}

