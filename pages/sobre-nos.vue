<template>
  <div class="about-us__container">
    <div class="about-us__container-content">
      <div class="about-us__container-content-emtu">
        <h2 class="about-us__container-content-title">
          Sobre o <span>projeto</span>
        </h2>
        <p class="about-us__container-content-paragraph">
          O software proposto faz o mapeamento entre as classificações dos níveis de
          deficiência dos passageiros e as adequações necessárias para que esses passageiros
          utilizem o sistema de transporte público metropolitano da melhor forma possível.
          Os dados e informações a serem utilizados neste projeto serão da Região Metropolitana do Vale do
          Paraíba e Litoral Norte de São Paulo (RMVPLN) e da Empresa Metropolitana de Transportes Urbanos de São Paulo
          (EMTU),
          parceira deste projeto de extensão.
        </p>
        <p class="about-us__container-content-paragraph">
          O software relaciona os CID (Código Internacional de Doenças) dos passageiros PcD com suas necessidades
          em termos de adequações nos veículos de transporte e a própria oferta do transporte
          público metropolitano. Espera-se que o software desenvolvido seja capaz de orientar o usuário no seu
          dia-a-dia,
          assim como gere informações para que a empresa possa atendê-lo da melhor forma possível.
          Ao final, o software será disponibilizado de forma aberta e gratuita.
        </p>
      </div>
      <div class="about-us__container-content-emtu-details">
        <div class="about-us__container-content">
          <div class="about-us__container-content-emtu-details">
            <v-icon size="300" class="about-us__container-content-emtu-details-icon">
              mdi-bus
            </v-icon>
          </div>
          <div class="about-us__container-content-title">
            <h2>
              <span>VApt</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
    <div class="about-us__container-content">
      <div class="about-us__container-content-codelab-details">
        <div class="about-us__container-content-codelab-images">
          <img src="../assets/images/logo-codelab.png">
        </div>
        <span class="about-us__container-content-emtu-details-text">
          Site desenvolvido e mantido pelo grupode extensão CodeLab da Universidade Federal do Estado de São Paulo
          (UNIFESP)
        </span>
      </div>
      <div class="about-us__container-content-codelab-details">
        <h2 class="about-us__container-content-title">
          Sobre o <span> CodeLab </span>
        </h2>
        <p class="about-us__container-content-paragraph">
          O CodeLab-Unifesp é um projeto formado por um grupo de estudantes com uma ideia revolucionária,
          a qual acreditamos que contribuirá para o desenvolvimento social. Ele é idealizado e coordenado pela
          Profa. Dra. Denise Stringhini.
        </p>
        <p class="about-us__container-content-paragraph">
          Oferecemos soluções inteligentes para duas ONG's de nossa região e nos orgulhamos da nossa atitude.
          Sempre buscamos o feedback construtivo dos nossos clientes a fim de melhorar e expandir o nosso projeto.
        </p>
        <p class="about-us__container-content-paragraph">
          Soluções inteligentes estão no centro do que fazemos no CodeLab-Unifesp. Nosso principal objetivo é
          encontrar formas inteligentes de usar a tecnologia a nosso favor para ajudar a construir um futuro
          melhor para todos, em todo lugar.
        </p>
        <p class="about-us__container-content-paragraph">
          Estamos sempre abertos a novas ideias e trabalhamos em conjunto para obter contínuamente o melhor.
        </p>
        <span class="about-us__container-content-paragraph">Para saber mais <a href="https://www.codelab-unifesp.org/"
            target="_blank">acesse nosso site.</a> </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$color-primary: #1976d2;

.about-us__container {
  width: 100%;
  padding: 1rem;
  position: relative;

  @media (min-width: 800px) {
    width: 60%;
    margin: 100px auto;
    padding: 0;
  }

  &-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;

    &-title {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 700;
      font-size: 2rem;

      margin-bottom: 1rem;

      color: #000000;

      span {
        color: $color-primary;
        opacity: 0.5;
      }

    }

    &-paragraph {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      font-size: 1rem;
      line-height: 32px;

      text-align: justify;
      letter-spacing: 0.25px;

      color: #000000;
    }

    &-emtu {
      &-details {
        display: flex;
        flex-direction: column;
        justify-content: center;

        &-icon {
          color: $color-primary;
          opacity: 0.5;
        }

        &-text {
          color: $color-primary;
          font-weight: bold;
          display: block;
          text-align: center;
        }
      }
    }

    &-codelab-images {
      align-items: center;
      text-align: center;
      img {
        width: 80%;
        height: 100%;
        object-fit: contain;
      }

      legend {
        margin-top: 0.4rem;
        font-size: 0.8rem;
        display: flex;
        justify-content: center;
      }

      span {
        font-size: 1rem;
        font-style: italic;
        display: block;
        margin-top: 1rem;
        text-decoration: underline;
        text-align: center;
      }
    }

    &-codelab-details {
      a {
        text-decoration: none;
      }
    }

    @media (min-width: 800px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
