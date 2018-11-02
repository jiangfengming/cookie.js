class Cookie {
  constructor({ maxAge, expires, path, domain, secure, samesite } = {}) {
    this.maxAge = maxAge
    this.expires = expires
    this.path = path
    this.domain = domain
    this.secure = secure
    this.samesite = samesite
  }

  set(name, value, {
    maxAge = this.maxAge,
    expires = this.expires,
    path = this.path,
    domain = this.domain,
    secure = this.secure,
    samesite = this.samesite
  } = {}) {
    let cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

    if (path) cookie += '; path=' + path
    if (domain) cookie += '; domain=' + domain

    // `max-age` is not compatible with any version of Internet Explorer, Edge and some mobile browsers.
    // so we convert `max-age` to `expires`
    if (maxAge != null) {
      expires = maxAge <= 0 ? 0 : Date.now() + maxAge * 1000
    }

    if (expires != null) {
      if (expires === Infinity) expires = 'Fri, 31 Dec 9999 23:59:59 GMT'
      else if (expires.constructor === Number) expires = new Date(expires).toUTCString()
      else if (expires instanceof Date) expires = expires.toUTCString()

      cookie += '; expires=' + expires
    }

    if (secure) cookie += '; secure'
    if (samesite) cookie += '; samesite=' + samesite
    document.cookie = cookie
  }

  get(name) {
    const result = document.cookie.match(new RegExp('(?:^\\s*|;\\s*)' + encodeURIComponent(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*=\\s*([^;]*)'))
    return result ? decodeURIComponent(result[1]) : null
  }

  remove(name, opts = {}) {
    opts.maxAge = 0
    this.set(name, '', opts)
  }
}

const cookie = new Cookie()

Cookie.set = cookie.set.bind(cookie)
Cookie.get = cookie.get.bind(cookie)
Cookie.remove = cookie.remove.bind(cookie)

export default Cookie