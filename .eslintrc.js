module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:vue-scoped-css/recommended',
    'plugin:vue/recommended'
  ],
  plugins: ['vue'],
  globals: {
    //
    // Tests variables
    //
    afterAll: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    beforeEach: 'readonly',
    describe: 'readonly',
    xdescribe: 'readonly',
    expect: 'readonly',
    it: 'readonly',
    xit: 'readonly',
    jest: 'readonly',
    cy: 'readonly',
    context: 'readonly',
    before: 'readonly',
    //
    // bdd-lazy-vars
    //
    def: 'readonly',
    get: 'readonly',
    sharedExamplesFor: 'readonly',
    includeExamplesFor: 'readonly',
    itBehavesLike: 'readonly',
    subject: 'readonly',
    fdescribe: 'readonly',
    fit: 'readonly'
  },
  // add your custom rules here
  rules: {
    'vue/multi-word-component-names': ['error', {
      ignores: []
    }]
  }
}
