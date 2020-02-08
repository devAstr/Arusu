
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Arusu',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/img/core.png' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://unpkg.com/bootstrap/dist/css/bootstrap.min.css' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://fonts.googleapis.com/css?family=Noto+Sans+TC&display=swap&subset=chinese-traditional'
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/Global.ts'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  bootstrapVue: {
    componentPlugins: [
        'EmbedPlugin',
        'FormSelectPlugin',
        'NavPlugin',
        'SpinnerPlugin',
        'TablePlugin',
        // 'ToastPlugin'
    ],
    // directivePlugins: ['VBScrollspyPlugin'],
    bootstrapCSS: false,
    bootstrapVueCSS: false
  },
  /*
  ** Build configuration
  */
  build: {
  /*
  ** You can extend webpack config here
  */
    babel: {
      presets: [
        [
          '@babel/preset-env',
          {
              'useBuiltIns': 'usage',
              'corejs': 3,
              'shippedProposals': true
          }
        ]
      ],
    plugins: [
        ['@babel/plugin-proposal-nullish-coalescing-operator'],
        ['@babel/plugin-proposal-optional-chaining'],
        ['@babel/plugin-syntax-dynamic-import']
      ]
    },
    // analyze: true,
    extend(config, {isClient, loaders: {vue, imgUrl}}) {
      if (isClient) {
        vue.transformAssetUrls.input = ['src'];
        imgUrl.limit = 4096;
      }
    }
  }
}
