const restored = window.localStorage.getItem('kana-writer')

if (restored) {
  source.resume.removeAttribute('hidden')
}

source.addEventListener('click', handleStart)

function handleStart(e) {
  console.log(e.target)
  e.preventDefault()
  source.setAttribute('hidden', '')
  writer.innerHTML = e.target.name === 'restore' ? restored : source.text.value.replace(/\n/g, '<br>').replace(/(?:[々〇〻\u2E80-\u2FDF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])+/g, '<ruby><rb>$&</rb><rt></rt></ruby>')
  document.querySelectorAll('ruby').forEach(el => el.addEventListener('click', createKanaInputOnRubyClick))
}

function createKanaInputOnRubyClick(e) {
  createKanaInput(e.currentTarget.lastElementChild)
}

function createKanaInput(parent) {
  const input = document.createElement('input')

  input.addEventListener('keydown', handleKanaInputKeyDown)
  input.addEventListener('keyup', handleKanaInputKeyUp)
  input.addEventListener('blur', handleKanaInputBlur)

  input.style.width = `${parent.textContent.length + 1}em`
  input.value = parent.textContent || ''

  parent.textContent = ''
  parent.appendChild(input)

  input.focus()
}

function handleKanaInputBlur(e) {
  console.log(e.target.type)
  e.target.parentNode.dataset.valid = !/(?:[々〇〻\u2E80-\u2FDF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])+/g.test(e.target.value)
  e.target.parentNode.textContent = e.target.value || ''
  e.target.remove()
  window.localStorage.setItem('kana-writer', writer.innerHTML)
}

function handleKanaInputKeyDown(e) {
  if (e.key === 'Enter' ||  e.key === 'Tab') {
    e.preventDefault()
  }
  if (e.target.value) {
    e.target.style.width = `${e.target.value.length + 1}em`
  }
}

function handleKanaInputKeyUp(e) {
  switch (e.key) {
    case 'Tab':
    case 'Enter':
      const brothers = [...document.querySelectorAll(`ruby.kana rt`)]
      const index = brothers.indexOf(e.target.parentNode) + (e.shiftKey ? -1 : 1)
      createKanaInput(brothers[index < 0 ? brothers.length - 1 : index < brothers.length ? index : 0])
      break
  }
}

switchLanguage(navigator.language)
config.language.value = navigator.language
config.addEventListener('change', handleChangeLanguage)

function handleChangeLanguage(e) {
  switchLanguage(e.target.value)
}

function switchLanguage(code) {
  if (Array.from(config.language).findIndex(input => input.value === code) === -1) { return }
  document.querySelectorAll(`:lang(${code})`).forEach(el => el.style.removeProperty('display'))
  document.querySelectorAll(`[lang]:not(:lang(${code}))`).forEach(el => el.style.display = 'none')
}

window.addEventListener('copy', handleCopy)

function handleCopy(e) {
  const selection = window.getSelection()
  if (selection.type === 'Range') {
    const fragment = window.getSelection().getRangeAt(0).cloneContents()
  }

  fragment.querySelectorAll('[data-selectable="false"]').forEach(el => el.remove())

  e.clipboardData.setData('text/plain', fragment.textContent.replace(/\n{2,}/g, '\n\n'))

  e.preventDefault()
}

document.getElementById('save-html').onclick = function() {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style.display = 'none'
  a.href = URL.createObjectURL(new Blob([document.getElementById('lyrics').innerHTML], { type: 'text/html' }))
  a.download = document.getElementById('title').value
  a.click()
}
