/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

'use strict'

import Icarus from './icarus.js'

let HitKounter = {
  elements: {},
  scan() {
    let e = this.elements
      , pages = document.querySelectorAll('[data-hk-page]')

    e.current = document.querySelectorAll('[data-hk-page=current]')
    e.topArea = document.querySelectorAll('[data-hk-top-pages]')
    e.pages = new Map()
    for (let i = 0; i < pages.length; ++i) {
      let url = pages[i].attributes['data-hk-page'].value
        , arr = e.pages.get(url)
      if (url == 'current') { continue }
      if (arr) { arr.push(pages[i]) }
      else { e.pages.set(url, [pages[i]]) }
    }

    if (e.current.length) this.increment()
    if (pages.length > e.current.length) this.getPages()
    if (e.topArea.length) this.getTop()
  },
  increment() {
    let {elements} = this
    Icarus.request({
      api: 'hk.page.increment',
      v: '1.0',
      success(result) {
        for (let i = 0; i < elements.current.length; ++i) {
          elements.current[i].innerText = result.count
        }
      },
      failure(code, err) { console.log(code, err) }
    })
  },
  getPages() {
    let {elements} = this
    let pagesParam = []

    for (let iter = elements.pages.keys(), state = iter.next(); !state.done; state = iter.next()) {
      pagesParam.push({ url: state.value })
    }

    Icarus.request({
      api: 'hk.page.get',
      v: '1.0',
      pages: pagesParam,
      success(results) {
        for (let i = 0; i < results.length; ++i) {
          let arr = elements.pages.get(results[i].url)
          for (let j = 0; j < arr.length; ++j) {
            arr[j].innerText = results[i].count
          }
        }
      },
      failure(code, err) { console.log(code, err) }
    })
  },
  getTop() {

  }
}

window.onload = HitKounter.scan.bind(HitKounter)

window.HitKounter = HitKounter
export default HitKounter