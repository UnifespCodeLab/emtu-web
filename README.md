# emtu-web

## Requisitos

- [node](https://nodejs.org/en)
- [git](https://git-scm.com/)

## Clonando o repositório

```bash
$ git clone https://github.com/UnifespCodeLab/emtu-web
```

## Setup

```bash
# instalando dependências
$ npm install

# executa a aplicação no endereço localhost:3000
$ npm run dev
```

Para mais detalhes confira a [doc](https://nuxtjs.org) do nuxt.

## Sobre o estruturamento do projeto

No nuxt apenas o diretório de `pages` é obrigatório. Os outros possuem comportamentos específicos.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).

## Fluxo de desenvolvimento

- (opcional) Dê uma olhada em como funcionam os [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
- Vá até o board do github e encontre o [_emtu-web_](https://github.com/orgs/UnifespCodeLab/projects/4)
- Encontre a issue desejada
- Atribua a si mesmo
- Mude para a coluna _In Progress_
- Com o projeto já clonado em sua pasta desejada, crie uma branch baseada no que está fazendo. Por exemplo:
  - `git checkout -b issue-10`
- Uma boa prática é sempre deixar seus commits o mais '_atômicos_' possível
- Quando todo o desenvolvimento estiver finalizado abra um [pull request](https://github.com/UnifespCodeLab/emtu-api/compare). Lembrando precisa ser nesse sentido: `base: main` <- `compare: issue-10`
- Marque os revisores para que os mesmos recebam notificação e revisem o seu pr
- Vincule a issue aberta com o seu pr
- Corra pro abraço

## Troubleshooting

- Versão do `node`:
  - Utilizando versões acima da <b>16</b> é possível que o erro `ERR_OSSL_EVP_UNSUPPORTED` apareça em sua tela. Como solução é possível passar uma _env_ que fará com que o projeto utilize a versão legado do _ssl provider_:
  - Em seu terminal execute: `export NODE_OPTIONS=--openssl-legacy-provider`
