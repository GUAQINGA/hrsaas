import Vue from 'vue'
import Cookie from 'js-cookie'
import VueI18n from 'vue-i18n'
import ElementZH from 'element-ui/lib/locale/lang/zh-CN'
import ElementEN from 'element-ui/lib/locale/lang/en'
import zh from './zh'
import en from './en'

Vue.use(VueI18n)
export default new VueI18n({
  locale: Cookie.get('language') || 'zh',
  messages: {
    zh: {
      ...ElementZH,
      ...zh
    },
    en: {
      ...ElementEN,
      ...en
    }
  }
})
