# Agente Biográfico

Protótipo web que conduz uma entrevista sobre a vida de uma pessoa e transforma as respostas em um livro de memórias editável em Word.

- **Aplicação:** https://kueno07.github.io/agente-biografico/
- **Código:** https://github.com/Kueno07/agente-biografico
- **Idioma da interface:** português, inglês, alemão e espanhol
- **Estado:** protótipo individual. A geração depende de uma chave de API do provedor escolhido.

## O que demonstra

- Entrevista organizada em oito capítulos, com duas perguntas iniciais por capítulo.
- Perguntas de aprofundamento geradas a partir das respostas, com opção de pular.
- Geração de narrativa por capítulo e exportação de um DOCX que pode ser editado, impresso e compartilhado.
- Inclusão opcional de fotos, processadas no navegador com efeito sépia e composição em mosaico.
- Criação opcional de capa por serviço externo ou uso de uma imagem própria.
- Recuperação da sessão de texto no mesmo navegador e exportação manual das respostas em JSON.

O projeto nasceu como uma demonstração curta de como modelos de linguagem podem apoiar a preservação de histórias pessoais. O escopo é um protótipo de uso individual; não há conta, colaboração, sincronização ou operação de serviço.

## Fluxo técnico

```text
index.html (interface e lógica no navegador)
  ├─ respostas → localStorage no navegador para recuperação da sessão
  ├─ pergunta de aprofundamento e narrativa → API do provedor de IA escolhido
  ├─ capa opcional → Pollinations, com um prompt genérico sem nome ou respostas
  ├─ fotos → processamento local via Canvas
  └─ livro → geração local de DOCX e download

GitHub Pages serve apenas os arquivos estáticos; não há backend do projeto.
```

O DOCX é montado no navegador como um pacote ZIP/XML, sem biblioteca externa de geração de documentos.

## Dados e privacidade

As respostas podem conter dados pessoais e informações sensíveis. O app as salva automaticamente em `localStorage` para permitir a recuperação no mesmo perfil e navegador. Esse backup permanece ali até ser substituído ou apagado nos dados do site pelo usuário. A exportação JSON cria outra cópia local, que passa a ser responsabilidade de quem a baixou.

Ao pedir aprofundamentos e gerar o livro, o app envia o texto necessário diretamente ao provedor selecionado (Groq, Google Gemini, OpenAI ou Anthropic). O provedor recebe esse conteúdo segundo seus próprios termos e políticas. O projeto não recebe essas chamadas. A chave é mantida apenas na memória da página durante a sessão, mas o navegador a envia ao provedor junto com as solicitações; por isso, não deve ser tratada como segredo protegido contra quem controla o dispositivo ou a sessão.

A capa gerada usa Pollinations. O prompt atual é genérico e não contém o nome nem as respostas. Fotos adicionadas aos capítulos são processadas no navegador e embutidas no DOCX; não são enviadas aos provedores de IA pelo código do app.

Antes de usar, escolha uma chave adequada para testes, confira as condições e os custos do provedor e evite inserir histórias que você não queira transmitir a esse serviço. O app não oferece criptografia de backup, autenticação, controle de acesso ou exclusão remota.

## Limitações conhecidas

- A sessão salva é vinculada ao navegador e ao perfil local; não sincroniza entre dispositivos.
- O backup automático guarda idioma, nome e respostas em texto. Fotos, capa e chave de API não são persistidas nele.
- A integração com os provedores é feita direto do navegador. Disponibilidade, cobrança, limites e modelos podem mudar.
- A interface tem quatro idiomas; alguns metadados do DOCX incluem francês, mas isso não significa que o app tenha tradução completa para francês.
- Não há suíte automatizada de testes nem telemetria de uso. O repositório é um protótipo e requer validação manual com os provedores escolhidos.

## Executar localmente

1. Clone o repositório ou baixe `index.html`.
2. Abra o arquivo em um navegador moderno ou sirva-o por um servidor estático local.
3. Selecione um provedor, crie ou use uma chave de API e leia os termos de uso antes de inserir histórias.

O uso das APIs exige conexão com a internet. O projeto não contém chaves de API.

## Estrutura

```text
.
├── index.html  # interface, perguntas, chamadas de API e montagem do DOCX
├── README.md   # apresentação, arquitetura e limites
└── LICENSE     # MIT
```

## Licença

MIT. Consulte [LICENSE](LICENSE).
