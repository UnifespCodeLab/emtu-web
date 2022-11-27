<template>
  <div class="main-container">
    <h1 class="title-style">
      Sobre nós
    </h1>
    <div class="main-content">
      <div class="text-container">
        <p>
          O CodeLab-Unifesp é um projeto formado por um grupo de estudantes com uma ideia revolucionária,
          a qual acreditamos que contribuirá para o desenvolvimento social.
          Ele é idealizado e coordenado pela Profa. Dra. Denise Stringhini.
        </p>
        <p>
          Acreditamos que o conhecimento e a ousadia tecnológica podem integrar o meio acadêmico com o social,
          fornecendo ideias e projetos que beneficiam inúmeras pessoas, levando todos ao sucesso.
        </p>
        <p>
          Oferecemos soluções inteligentes para duas ONG's de nossa região e nos orgulhamos da nossa atitude.
          Sempre buscamos o feedback construtivo dos nossos clientes a fim de melhorar e expandir o nosso projeto.
        </p>
        <p>
          Soluções inteligentes estão no centro do que fazemos no CodeLab-Unifesp. Nosso principal objetivo é encontrar
          formas inteligentes de usar a tecnologia a nosso favor para ajudar a construir um futuro melhor para todos, em
          todo lugar.
        </p>
        <p>
          Estamos sempre abertos a novas ideias e trabalhamos em conjunto para obter contínuamente o melhor.
        </p>
      </div>
      <div style="flex-direction:column;">
        <img
          class="search-page__image"
          src="../assets/images/code-lab-grupo-1.jpg"
          alt="foto-grupo-1"
        >
        <img
          class="search-page__image"
          src="../assets/images/foto-code-lab-2.jpg"
          alt="foto-grupo-2"
        >
      </div>
    </div>
    <h3 class="footer-text">
      "A extensão universitária tem de se aproximar mais de sua comunidade
      visando a ampliação do conhecimento e automatização de suas tarefas."
    </h3>
  </div>
</template>
<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content:center ;
  margin: 35px 75px 30px 75px;
}

.title-style {
  margin-bottom: 80px;
}

.text-container {
  width: 448px;
  text-align: justify;
}

p {
  margin-bottom: 30px;
}

.main-content {
  display:flex;
}

.search-page__image {
  display: none;
  margin-left: 150px;
  margin-bottom: 60px;
  @media (min-width: 1200px) {
    display: flex;
    max-width: 500px;
    object-fit: cover;
  }
}

.footer-text {
  width:650px;
}
</style>
