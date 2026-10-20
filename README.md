# Agente Biográfico

Protótipo web que conduz uma entrevista sobre a vida de uma pessoa e transforma as respostas em um livro de memórias editável em Word.

- **Aplicação:** https://kueno07.github.io/agente-biografico/
- **Código:** https://github.com/Kueno07/agente-biografico
- **Idioma da interface:** português, inglês, alemão e espanhol
- **Estado:** protótipo individual. A geração depende de uma chave de API do provedor escolhido.

## O que demonstra

- Entrevista organizada em oito capítulos, com duas perguntas iniciais por capítulo.
- Nota opcional por capítulo para registrar o contexto lembrado a partir de fotos, objetos ou documentos; a nota pode ser revista e corrigida na tela de revisão antes de reescrever o capítulo.
- Perguntas de aprofundamento geradas a partir das respostas, com opção de pular sem perder a resposta principal.
- Rascunho narrativo por capítulo, com edição e nova geração antes de montar o livro.
- Escolha de título, subtítulo e dedicatória; sumário atualizável, metadados, capítulos paginados e numeração no DOCX.
- Inclusão opcional de fotos, processadas no navegador com efeito sépia e composição em mosaico.
- Criação opcional de capa por serviço externo ou uso de uma imagem própria.
- Recuperação local de respostas e rascunhos editados no mesmo navegador, com exportação e importação de backup JSON versão 2.
- Protocolo editorial com dados fictícios para comparar fidelidade, tratamento de incerteza, voz e clichês: [docs/avaliacao-editorial-ficticia.md](docs/avaliacao-editorial-ficticia.md).

O projeto nasceu como uma demonstração curta de como modelos de linguagem podem apoiar a preservação de histórias pessoais. O escopo é um protótipo de uso individual; não há conta, colaboração, sincronização ou operação de serviço.

## Fluxo técnico

```text
index.html (interface e lógica no navegador)
  ├─ respostas, notas opcionais e manuscrito editado → localStorage no navegador para recuperação
  ├─ respostas e notas opcionais → API do provedor de IA escolhido quando a pessoa solicita geração
  ├─ capa opcional → Pollinations, com um prompt genérico sem nome ou respostas
  ├─ fotos → processamento local via Canvas
  └─ livro → geração local de DOCX e download

GitHub Pages serve apenas os arquivos estáticos; não há backend do projeto.
```

O DOCX é montado no navegador como um pacote ZIP/XML, sem biblioteca externa de geração de documentos. O backup JSON pode ser importado pela tela inicial; o arquivo precisa ter até 5 MB e passar pela validação de estrutura antes de substituir a sessão local.

## Dados e privacidade

As respostas, notas opcionais e capítulos editados podem conter dados pessoais e informações sensíveis. O app os salva automaticamente em `localStorage` para permitir a recuperação no mesmo perfil e navegador. Esse backup permanece ali até ser substituído ou apagado nos dados do site pelo usuário. A exportação JSON cria outra cópia local, que passa a ser responsabilidade de quem a baixou. O backup pode ser reimportado pela tela inicial; a validação limita o arquivo a 5 MB e verifica versão, campos e tamanhos antes de gravar.

Ao pedir aprofundamentos e gerar ou reescrever o livro, o app envia o texto necessário diretamente ao provedor selecionado (Groq, Google Gemini, OpenAI ou Anthropic). As notas opcionais também são enviadas junto com as respostas. O provedor recebe esse conteúdo segundo seus próprios termos e políticas. O projeto não recebe essas chamadas. A chave é mantida apenas na memória da página durante a sessão, mas o navegador a envia ao provedor junto com as solicitações; por isso, não deve ser tratada como segredo protegido contra quem controla o dispositivo ou a sessão.

A capa gerada usa Pollinations. O prompt atual é genérico e não contém o nome nem as respostas. Fotos adicionadas aos capítulos são processadas no navegador e embutidas no DOCX; não são enviadas aos provedores de IA pelo código do app.

Antes de usar, escolha uma chave adequada para testes, confira as condições e os custos do provedor e evite inserir histórias que você não queira transmitir a esse serviço. O app não oferece criptografia de backup, autenticação, controle de acesso ou exclusão remota.

## Limitações conhecidas

- A sessão salva é vinculada ao navegador e ao perfil local; não sincroniza entre dispositivos.
- O backup automático versão 2 guarda idioma, nome, respostas, notas por capítulo, manuscritos editados, título, subtítulo, dedicatória e data. Fotos, capa e chave de API não são persistidas nele. A importação valida formato, campos e limites de tamanho; armazenamento local indisponível ou backup inválido é informado na interface.
- A integração com os provedores é feita direto do navegador. Disponibilidade, cobrança, limites e modelos podem mudar.
- A interface tem quatro idiomas; alguns metadados do DOCX incluem francês, mas isso não significa que o app tenha tradução completa para francês.
- Há testes locais para a estrutura do ZIP/DOCX, metadados, backup e nome do arquivo. Eles não chamam provedores de IA nem validam a qualidade literária de cada modelo.
- Não há telemetria de uso. O projeto segue sendo um protótipo e requer revisão humana do conteúdo e validação manual com o provedor escolhido.

## Executar localmente

1. Clone o repositório ou baixe `index.html`.
2. Abra o arquivo em um navegador moderno ou sirva-o por um servidor estático local.
3. Selecione um provedor, crie ou use uma chave de API e leia os termos de uso antes de inserir histórias.

O uso das APIs exige conexão com a internet. O projeto não contém chaves de API.

## Verificações locais

Com Node.js instalado, execute `node --test tests/app.test.cjs`. A suíte usa apenas módulos nativos do Node e não faz chamadas externas.

Na revisão desta versão, um DOCX sintético foi aberto e exportado para PDF pelo Microsoft Word. O conteúdo usado nessa verificação era fictício. A saída real de cada provedor ainda precisa de revisão humana.

## Estrutura

```text
.
├── index.html  # interface, perguntas, chamadas de API e montagem do DOCX
├── README.md   # apresentação, arquitetura e limites
├── ROADMAP.md  # fases e critérios de conclusão
├── docs/       # protocolo de avaliação editorial fictícia
│   └── avaliacao-editorial-ficticia.md
└── LICENSE     # MIT
```

## Licença

MIT. Consulte [LICENSE](LICENSE).
