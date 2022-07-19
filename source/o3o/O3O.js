class O3O {

  replyTo = null

  constructor(options) {
    let defaultOptions = {
      key: "mizore",
      api: "http://localhost:8080"
    }
    for (let defaultKey in defaultOptions) {
      if (defaultOptions.hasOwnProperty(defaultKey) && !options.hasOwnProperty(defaultKey)) {
        options[defaultKey] = defaultOptions[defaultKey]
      }
    }
    this.options = options
    // 输出框架
    document.write(`<div class="O3O" key="${this.options.key}">
                      <div class="c-body">
                        <form class="c-info">
                          <div class="c-i-blank"></div>
                          <input class="c-i-input ci-nickname" placeholder="昵称" type="text">
                          <div class="c-i-blank"></div>
                          <input class="c-i-input ci-email" placeholder="邮箱" type="text">
                          <div class="c-i-blank"></div>
                          <input class="c-i-input ci-site" placeholder="网址" type="text">
                          <div class="c-i-blank"></div>
                        </form>
                        <textarea class="c-area" placeholder="留下你的足迹~"></textarea>
                      </div>
                      <div class="c-bar between">
                        <div class="c-b-left between">
                          <div class="c-b-button space">O3O</div>
                          <div class="c-b-button at-user">@</div>
                        </div>
                        <div class="c-b-right between">
                          <div class="count"><span class="count-num">0</span> / 400</div>
                          <div class="c-b-button c-b-submit">发布</div>
                        </div>
                      </div>
                      <div class="o-comments">
                        <h2 class="o-c-title">评论 <span class="o-c-count">0</span></h2>
                        <ul class="o-c-list">
                          还没有评论呢~
                        </ul>
                      </div>
                    </div>`)
    Array.prototype.forEach.call(document.getElementsByClassName("O3O"), (e) => {
      if (e.getAttribute("key") === this.options.key) {
        this.o3o = e;
      }
    })
    this.pageId = this.options.key + "-" + document.title
  }

  init() {
    this.o3o.getElementsByClassName("c-area")[0].oninput = this.countWords
    this.o3o.getElementsByClassName("at-user")[0].onclick = this.resetReplyTo
    this.o3o.getElementsByClassName("c-b-submit")[0].onclick = this.comment
    this.getComments()
  }

  countWords = (event) => {
    const { target } = event
    const count = target.value.trim().length
    let countNumElement = this.o3o.getElementsByClassName("count-num")[0]
    countNumElement.innerText = count
    if (count > 400) {
      countNumElement.className = "count-num warning"
    } else {
      countNumElement.className = "count-num"
    }
  }

  resetReplyTo = () => {
    this.replyTo = null
    this.o3o.getElementsByClassName("at-user")[0].innerText = "@"
  }

  comment = () => {
    let requestBody = {
      pageId: this.pageId
    }
    if (this.replyTo != null) {
      requestBody.replyTo = this.replyTo
    }
    // 检查昵称
    let ciNickname = this.o3o.getElementsByClassName("ci-nickname")[0]
    if (this.nickNameCheck(ciNickname)) {
      requestBody.guestName = this.o3o.getElementsByClassName("ci-nickname")[0].value.trim()
    } else {
      return
    }
    // 检查邮箱
    let ciEmail = this.o3o.getElementsByClassName("ci-email")[0]
    if (this.emailCheck(ciEmail)) {
      requestBody.guestEmail = this.o3o.getElementsByClassName("ci-email")[0].value.trim()
    } else {
      return
    }
    // 检查网址
    let ciSite = this.o3o.getElementsByClassName("ci-site")[0]
    if (this.siteCheck(ciSite)) {
      requestBody.guestSite = this.o3o.getElementsByClassName("ci-site")[0].value.trim()
    } else {
      return
    }

    let cArea = this.o3o.getElementsByClassName("c-area")[0]
    if (this.commentCheck(cArea)) {
      requestBody.comment = this.o3o.getElementsByClassName("c-area")[0].value.trim()
    } else {
      return
    }

    fetch(`${this.options.api}/comment/add`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      }
    })
      .then(response => response.json())
      .then((json) => {
        console.log(json);
        this.lockSubmit()
        this.getComments()
      })
  }

  lockSubmit = () => {
    this.o3o.getElementsByClassName("c-b-submit")[0].className += " b-lock"
    const athis = this
    setTimeout(() => {
      console.log(athis);
      athis.o3o.getElementsByClassName("c-b-submit")[0].className = "c-b-button c-b-submit"
    }, 5000)
  }

  getComments = () => {
    fetch(`${this.options.api}/comment/tree/${this.pageId}`)
      .then(response => response.json())
      .then((json) => {
        console.log(json)
        this.treeToDom(json.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  nickNameCheck = (ciNickname) => {
    let result = true
    if (ciNickname.value.trim() == "") {
      ciNickname.setAttribute("placeholder", "请输入昵称！")
      result = false
    } else if (ciNickname.value.trim().length > 10) {
      ciNickname.setAttribute("placeholder", "昵称最长为10！")
      result = false
    }
    if (!result) {
      this.o3o.getElementsByClassName("ci-nickname")[0].value = ""
      ciNickname.className = ciNickname.className + " c-i-warning"
    }
    return result
  }

  emailCheck = (ciEmail) => {
    let result = true
    if (ciEmail.value.trim() == "") {
      ciEmail.setAttribute("placeholder", "请输入邮箱！")
      result = false
    } else if (ciEmail.value.trim().length > 30) {
      ciEmail.setAttribute("placeholder", "邮箱最长为30！")
      result = false
    } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(ciEmail.value.trim())) {
      ciEmail.setAttribute("placeholder", "邮箱不正确！")
      result = false
    }
    if (!result) {
      this.o3o.getElementsByClassName("ci-email")[0].value = ""
      ciEmail.className = ciEmail.className + " c-i-warning"
    }
    return result
  }

  siteCheck = (ciSite) => {
    let result = true
    if (ciSite.value.trim() == "") {
      ciSite.setAttribute("placeholder", "请输入网址！")
      result = false
    } else if (ciSite.value.trim().length > 30) {
      ciSite.setAttribute("placeholder", "网址最长为30！")
      result = false
    } else if (!/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(ciSite.value.trim())) {
      ciSite.setAttribute("placeholder", "网址错误！")
      result = false
    }
    if (!result) {
      this.o3o.getElementsByClassName("ci-site")[0].value = ""
      ciSite.className = ciSite.className + " c-i-warning"
    }
    return result
  }

  commentCheck = (cArea) => {
    if (cArea.value.trim() == "") {
      cArea.setAttribute("placeholder", "请输入评论！")
      this.o3o.getElementsByClassName("c-area")[0].value = ""
      cArea.className = cArea.className + " c-i-warning"
      return false
    }
    if (cArea.value.trim().length > 400) {
      return false
    }
    return true
  }

  treeToDom = (tree) => {
    this.o3o.getElementsByClassName("o-c-list")[0].innerHTML = ""
    tree.map((comment1) => {
      let commentLi = document.createElement("li")
      commentLi.className = "o-comment"
      commentLi.innerHTML = `<div class="o-c-header">
                            <span class="o-c-guestName">${comment1.guestName}</span>
                          </div>
                          <div class="o-c-text">${comment1.comment}</div>
                          <div class="o-c-footer">
                            <span class="o-c-date">${this.dateFormat("YYYY-mm-dd HH:MM:SS", new Date(comment1.date))}</span>
                            <span class="reply-button" data-id="${comment1.id}" data-guestName="${comment1.guestName}">回复</span>
                          </div>
                          <ul class="o-replys"></ul>`
      commentLi.getElementsByClassName("reply-button")[0].onclick = this.changeReplyTo
      let replyUl = commentLi.getElementsByClassName("o-replys")[0]
      for (let i = 0; i < comment1.replys.length; i++) {
        this.traversal(comment1.replys[i], replyUl, comment1.guestName, 1)
      }
      this.o3o.getElementsByClassName("o-c-list")[0].appendChild(commentLi)
    })
    this.o3o.getElementsByClassName("o-c-count")[0].innerText = tree.length
  }

  //深度遍历评论树
  traversal = (comment, replyUl, father, depth) => {
    let replyLi = document.createElement("li")
    replyLi.innerHTML = `<div class="o-r-header">
                        <span class="o-c-guestName">${comment.guestName}</span>
                        </div>
                        <div class="o-r-text">${comment.comment}</div>
                        <div class="o-c-footer">
                          <span class="o-c-date">${this.dateFormat("YYYY-mm-dd HH:MM:SS", new Date(comment.date))}</span>
                          <span class="reply-button" data-id="${comment.id}" data-guestName="${comment.guestName}">回复</span>
                        </div>`
    replyLi.className = "o-reply"
    replyLi.getElementsByClassName("reply-button")[0].onclick = this.changeReplyTo
    if (depth != 1) {
      let span1 = document.createElement("span")
      span1.innerText = "→ "
      let span2 = document.createElement("span")
      span2.innerText = father
      span2.className = "o-c-guestName"
      replyLi.getElementsByClassName("o-r-header")[0].appendChild(span1)
      replyLi.getElementsByClassName("o-r-header")[0].appendChild(span2)
    }
    replyUl.appendChild(replyLi)
    for (let i = 0; i < comment.replys.length; i++) {
      this.traversal(comment.replys[i], replyUl, comment.guestName, depth + 1)
    }
  }

  changeReplyTo = (event) => {
    const { target } = event
    console.log("回复:" + target.getAttribute("data-id"));
    this.replyTo = parseInt(target.getAttribute("data-id"))
    this.o3o.getElementsByClassName("at-user")[0].innerText = `@${target.getAttribute("data-guestName")}`
  }

  dateFormat = (fmt, date) => {
    let ret;
    const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
    };
    return fmt;
  }

}



