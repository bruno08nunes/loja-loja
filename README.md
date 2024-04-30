# Loja Loja

Esta é a documentação da loja virtual _Loja Loja: A Loja mais Loja de Todas_. Aqui falará sobre o site, tendo a descrição, os requisitos, local de hospedagem, anotações de desenvolvimento e como usar o git para desenvolver o site.

## Sumário

1. [Descrição](#descrição)
1. [Lista de Tarefas](#lista-de-tarefas)
1. [Desenvolvimento](#desenvolvimento)
    1. [Configurar no Git](#configurar-no-git)
    1. [Clonando o Repositório na Máquina](#clonando-o-repositório-na-máquina)
    1. [Fazendo Alterações no Projeto](#fazendo-alterações-no-projeto)
1. [Requisitos](#requisitos)
1. [Objetivos](#objetivos)
1. [Linguagens Utilizadas](#linguagens-utilizadas)
1. [Design](#design)
1. [Ideias de Produtos](#ideias-de-produtos)
1. [Formatação e Convenções](#formatação-e-convenções)
1. [Imagens](#imagens)

## Descrição

_Loja Loja: A Loja mais Loja de Todas_ é uma loja virtual em que é possível visualizar e fazer a compra de diversos produtos e serviços, como um aperto de mão aleatório, o conceito de plano cartesiano, a cor rosa choque e unidades únicas de nada.

## Lista de Tarefas

## Desenvolvimento

Você precisa ter uma conta no github e ter sido colocado como colaborador do projeto.

### Configurar no Git

Caso não esteja configurado no Git, você deve colocar no git bash os comandos:

```
git config --global user.name "Nome de Usuário"
git config --global user.email "emailgithub@gmail.com"
```

### Clonando o repositório na máquina

É necessário fazer uma clonagem do repositório na sua máquina. Para isso, você deve colocar no git bash os comandos:

```
git clone https://github.com/bruno08nunes/loja-loja.git
cd loja-loja
```

### Fazendo alterações no projeto

Antes de começar a trabalhar, é sempre recomendado puxar as alterações feitas para a sua máquina, usando o comando:

```
git pull origin main
```

Também é recomendado criar uma nova branch para fazer as alterações. Você deve fazer usando:

```
git checkout -b dev
```

É recomendado que as alterações sejam feitas por etapas, de pouco a pouco. Você deve fazer um commit com as alterações feitas, colocando no git bash:

```
git add .
git commit -m "Mensagem descrevendo as alterações"
```

Após as alterações serem concluídas, você deve voltar para a branch principal, fazer um pull para caso o repositório remoto tenha sido alterado e fazer um merge com a branch dev.

```
git checkout main
git pull origin main
git merge dev
```

Depois é necessário apenas enviar para o repositório remoto. Caso você já esteja conectado entre o git e o github, você deve executar o primeiro código, se não, o segundo.

1.
```
git push -u origin main
```
2.
```
git push origin main
```

Para mais dúvidas, veja: [Git e Github - Tutorial](https://docs.google.com/document/d/1UeFRh8nkwYq1HemMNNc_1RpyQb_FGNWZEEgKtZuF8Ko/edit)

## Requisitos

## Objetivos

## Linguagens Utilizadas

## Design

## Ideias de Produtos

## Formatação e Convenções

## Imagens