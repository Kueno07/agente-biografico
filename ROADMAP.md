# Plano de aprimoramento

**Projeto:** Agente Biográfico  
**Versão do plano:** 1.0  
**Data:** 2026-10-19  
**Base da avaliação:** implementação em `index.html` e documentação atual em `README.md`.

## Objetivo do produto

Ajudar uma pessoa a registrar memórias por meio de uma entrevista guiada e transformar as respostas em um livro editável, preservando a voz e os fatos fornecidos pela própria pessoa.

O produto deve ser simples o bastante para uma sessão individual, claro sobre o destino dos dados e confiável na recuperação das respostas e na exportação do documento. A premissa deste plano é manter o projeto como ferramenta individual, estática e com chave própria do usuário. Uma versão hospedada para público amplo exige uma decisão de arquitetura e privacidade antes de receber histórias reais.

## Diagnóstico atual

O protótipo já demonstra o fluxo principal: oito capítulos, perguntas iniciais e aprofundamentos por IA, geração de narrativa, fotos opcionais, capa e exportação DOCX. Também oferece recuperação local de texto e exportação manual JSON.

Os limites que mais afetam a confiança e a qualidade são:

- A aplicação concentra interface, estado, integrações e criação do DOCX em um único `index.html` de aproximadamente 98 KB.
- O texto das memórias fica em `localStorage` sem criptografia; quem usa o mesmo perfil do navegador pode acessá-lo.
- Respostas são enviadas diretamente ao provedor de IA selecionado. Não há camada intermediária para controlar retenção, cobrança ou disponibilidade.
- A chave fica na memória da página, mas não está protegida contra quem controla o dispositivo ou a sessão do navegador.
- A suíte automatizada cobre estrutura inicial do ZIP/DOCX, backup e prompts; ainda não cobre o fluxo de interface nem falhas de rede e armazenamento.
- A recuperação automática não inclui fotos, capa nem chave. O texto permanece sem criptografia no armazenamento local.
- A narrativa ainda depende da qualidade de resposta do provedor escolhido. Não há avaliação com saídas reais nem validação por leitores beta.

## Progresso de implementação

**Atualizado em 2026-10-19.** As fases abaixo estão parcialmente implementadas; os pontos restantes continuam no roadmap.

- **Fase 0 — parcial:** o app pede consentimento antes de enviar respostas ao provedor de IA e oferece apagar o backup local. A cópia continua sem criptografia; a decisão não cobre compartilhamento do dispositivo, fotos e capa não entram no backup, e o app não consegue apagar cópias baixadas nem dados retidos por provedores.
- **Fase 1 — parcial:** o backup local versão 2 recupera respostas, notas opcionais por capítulo, capítulos editados, título, subtítulo e dedicatória. A tela inicial aceita importar backup JSON de até 5 MB, valida estrutura/campos antes de substituir a cópia local e sinaliza backup corrompido ou falha de salvamento. Fotos e capa continuam fora do backup.
- **Fase 2 — parcial:** as perguntas e instruções de escrita foram revistas nos quatro idiomas para reduzir pressupostos e preservar os fatos. Notas opcionais permitem registrar contexto lembrado por fotos, objetos ou documentos; podem ser corrigidas na revisão e reenviadas ao reescrever o capítulo. O texto da nota é salvo localmente e enviado ao provedor junto com as respostas, enquanto o arquivo visual permanece local. O usuário edita capítulos, consulta respostas e notas usadas de base, pede nova redação e ajusta título, subtítulo e dedicatória. O DOCX ganhou sumário atualizável, metadados e paginação. A qualidade literária de respostas reais dos provedores ainda não foi avaliada.
- **Avaliação editorial — preparada:** `docs/avaliacao-editorial-ficticia.md` contém dois casos com rascunhos de referência, incertezas, versões conflitantes, notas complementares e critérios de falha grave. A avaliação não foi executada porque não há chaves de API configuradas no ambiente; saídas reais e custos permanecem sem registro.
- **Modelos — atualizados:** as opções OpenAI e Anthropic apontam para IDs ativos nas documentações consultadas em 2026-10-19. GPT-5.6 Sol usa `max_completion_tokens` e baixo esforço de raciocínio para texto de capítulo; a compatibilidade ainda depende de chamada com chave válida. Consulte [OpenAI GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol), [status dos modelos Claude](https://platform.claude.com/docs/en/about-claude/model-deprecations), [modelos Gemini](https://ai.google.dev/gemini-api/docs/models) e [modelos Groq](https://console.groq.com/docs/models) antes de trocar IDs novamente.
- **Fase 3 — parcial:** há seis testes locais sem chamadas externas para ZIP/DOCX, metadados, backup, nomes de arquivo e requisitos dos prompts. As requisições de IA agora têm timeout de 90 segundos e validam a forma da resposta; imagens compatíveis de até 15 MB têm tratamento de erro e limite de dimensão decodificada. Essas alterações ainda não foram verificadas em execução. O app continua num único arquivo; ainda não há teste ponta a ponta da interface.
- **Fase 4 — pendente:** não houve teste moderado nem publicação de amostra fictícia atualizada.

Um DOCX sintético foi aberto e exportado para PDF pelo Microsoft Word para inspeção de layout. A amostra não usou conteúdo pessoal nem um provedor de IA.

## Princípios de decisão

1. **Privacidade antes de conveniência:** informar cada transmissão antes do primeiro envio e minimizar os dados enviados.
2. **A pessoa é a fonte da verdade:** a IA pode organizar e redigir, mas não deve inventar fatos, relações, datas ou falas.
3. **Revisão antes de publicação:** todo capítulo gerado deve poder ser editado antes de virar o livro.
4. **Recuperação sem surpresa:** deixar visível o que está salvo, onde está salvo e como apagar ou exportar.
5. **Escopo enxuto:** manter uma boa experiência individual antes de construir contas, sincronização ou colaboração.
6. **Alegações verificáveis:** README, interface e portfólio só dizem que algo funciona quando houver evidência de teste.

## Escopo recomendado

### Incluído

- Entrevista individual organizada por capítulos, com avanço, retorno, edição e opção de pular perguntas.
- Salvamento e recuperação locais, com indicação clara de status e ação explícita para apagar a sessão.
- Uso configurável dos provedores de IA já suportados, com validação, timeout, erros compreensíveis e instruções para evitar envio acidental.
- Geração por capítulo com preservação de fatos, revisão e edição pelo usuário.
- Exportação DOCX validada e backup JSON versionado, com importação validada se a restauração continuar sendo necessária.
- Documentação fiel ao comportamento e demonstração de portfólio com dados fictícios.

### Fora do escopo inicial

- Contas, login, banco centralizado, sincronização entre dispositivos e colaboração familiar.
- Publicação ou compartilhamento automático do livro.
- Assinatura, cobrança de usuários, telemetria de conteúdo ou retenção de memórias em servidor próprio.
- Garantia de confidencialidade dos provedores externos ou de armazenamento criptografado no navegador.

Esses itens reabrem a decisão de produto e exigem análise própria de segurança, custo, consentimento e operação.

## Roadmap priorizado

### Fase 0 — Contrato do produto e privacidade

**Prioridade:** P0 · **Dependência:** nenhuma

- Definir em uma tela curta o que é salvo no navegador, o que é enviado ao provedor e o que não é enviado.
- Mostrar o provedor selecionado e pedir confirmação antes do primeiro envio de texto.
- Informar que chaves de API podem gerar custos e não são protegidas contra quem controla o dispositivo.
- Adicionar ações visíveis para exportar e apagar a sessão local; confirmar antes da exclusão.
- Revisar todos os fluxos de dados, incluindo capa, fotos, backup, erros e mensagens de suporte.
- Substituir linguagem que possa sugerir sigilo, aconselhamento ou preservação garantida por descrições precisas do protótipo.

**Critérios de aceite:** uma pessoa consegue identificar antes de começar onde os dados ficam, quais serviços recebem texto e como apagar a recuperação local. Nenhuma chamada transmite nome ou respostas sem aviso e ação iniciada pela pessoa.

### Fase 1 — Fluxo de entrevista recuperável

**Prioridade:** P0 · **Dependência:** Fase 0

- Formalizar o estado da sessão e salvar um formato JSON com número de versão e validação de campos.
- Recuperar a sessão após recarga sem perder capítulo, respostas ou posição da entrevista.
- Permitir voltar e editar respostas sem duplicar ou corromper os dados.
- Adicionar indicador de salvamento, data da última atualização e opção de iniciar uma nova história.
- Tratar JSON inválido, indisponibilidade de armazenamento e limite de espaço com mensagens úteis.
- Definir o tratamento de fotos e capa: ou incluí-las em exportação/importação com limites explícitos, ou indicar claramente que exigem seleção novamente.

**Critérios de aceite:** recarregar a página restaura a sessão; editar uma resposta atualiza a mesma resposta; iniciar nova história e apagar a cópia salva são ações distintas e compreensíveis.

### Fase 2 — Qualidade editorial e exportação

**Prioridade:** P1 · **Dependência:** Fase 1

- Reescrever e testar instruções dos provedores para usar apenas os fatos nas respostas e marcar lacunas sem preenchê-las.
- Permitir revisar e editar cada capítulo antes de gerar o DOCX; regenerar um capítulo sem perder as edições dos demais.
- Deixar clara a diferença entre texto original, sugestão da IA e texto revisado pela pessoa.
- Validar respostas vazias, capítulos sem conteúdo, caracteres especiais e falhas parciais de geração.
- Revisar a estrutura do DOCX: capa, título, sumário ou navegação, hierarquia dos capítulos, imagens, quebra de página e metadados.
- Validar abertura e legibilidade em Microsoft Word e LibreOffice; definir tamanho máximo de fotos e documento.
- Usar nomes de arquivo previsíveis e seguros, sem depender de texto inválido fornecido no nome.

**Critérios de aceite:** usuário consegue corrigir o livro no app e no Word; o documento abre sem reparo em leitores testados; nenhum capítulo aparece como concluído quando a geração falhou.

### Fase 3 — Confiabilidade técnica e manutenção

**Prioridade:** P1 · **Dependência:** contratos das Fases 1 e 2 definidos

- Separar o HTML monolítico em módulos pequenos para interface, estado, provedores, armazenamento e DOCX.
- Criar uma configuração central de provedores, modelos, limites e capacidades, sem espalhar identificadores em várias funções.
- Adicionar limite de tempo, cancelamento quando possível, tratamento de respostas inválidas e mensagens sem dados pessoais nos logs.
- Adotar validação estática e suíte automatizada para estado, importação/exportação, escape de conteúdo e geração estrutural do DOCX.
- Definir política de dependências e registrar versões; evitar dependência externa desnecessária para o fluxo central.
- Atualizar README e guia de desenvolvimento quando a arquitetura mudar.

**Critérios de aceite:** operações principais podem ser testadas sem chamar serviços pagos; falhas de rede e respostas malformadas são cobertas; a interface não injeta conteúdo de usuário como HTML.

### Fase 4 — Validação com pessoas e publicação de portfólio

**Prioridade:** P2 · **Dependência:** Fases 0–3

- Fazer teste moderado com histórias fictícias ou autorizadas, começando por uma sessão curta.
- Observar entendimento do consentimento, facilidade de retomar, qualidade da narrativa e edição do DOCX.
- Corrigir os bloqueios observados antes de divulgar o link como ferramenta pronta para histórias reais.
- Publicar imagens recentes da interface e um exemplo de livro com conteúdo inteiramente fictício.
- Explicar no portfólio o problema, as decisões, as limitações e o que foi validado, sem inventar usuários, métricas ou resultados.
- Definir uma rotina simples de revisão de disponibilidade dos provedores e atualizar a lista de modelos quando mudar.

**Critérios de aceite:** demonstração pode ser repetida com dados fictícios; limitações e requisitos de chave estão visíveis; alegações públicas correspondem a testes registrados.

## Sequência de entrega

| Marco | Resultado | Pronto quando |
|---|---|---|
| M0 — Uso responsável | Avisos, consentimento, apagar/exportar e mapa de dados | Fluxo de dados está explicado antes de enviar texto |
| M1 — Entrevista confiável | Salvamento versionado, retomada e edição | Sessão sobrevive a recarga e pode ser apagada |
| M2 — Livro revisável | Edição por capítulo e DOCX validado | Livro abre nos leitores escolhidos e preserva revisão |
| M3 — Protótipo sustentável | Módulos, testes e documentação | Fluxo central coberto sem API externa |
| M4 — Apresentação pública | Teste de usabilidade e case fictício | Demonstração e alegações públicas têm evidência |

## Estratégia de arquitetura

**Recomendação atual:** manter o modo individual e local-first, com chave própria, enquanto o projeto for demonstração ou ferramenta pessoal. Não criar backend para “esconder” a chave sem redesenhar autenticação, cobrança, limites, retenção e proteção de conteúdo.

Se o objetivo mudar para um serviço público para pessoas sem chave própria, fazer antes um ADR (registro de decisão de arquitetura) comparando:

- aplicação local sem conta, com cópia e chave sob responsabilidade da pessoa;
- backend com autenticação, armazenamento protegido, exclusão, limites de custo e política de retenção;
- fluxo híbrido, com conteúdo local e chamadas de IA explicitamente autorizadas.

A decisão deve considerar ameaça, custo de suporte, cobrança dos provedores, direitos de exclusão e risco de vazamento. Nenhuma opção deve ser apresentada como “privada” sem definir contra quem protege e validar a implementação.

## Plano de validação

Já existem seis testes locais em `tests/app.test.cjs`, executáveis com `node --test tests/app.test.cjs`. Eles não fazem chamadas de rede. O ZIP/DOCX gerado com conteúdo fictício também foi aberto no Microsoft Word e convertido em PDF para inspeção visual; o renderizador LibreOffice empacotado não está disponível neste ambiente. As mudanças de timeout e processamento de imagens desta rodada não foram executadas nem validadas.

Ainda faltam:

- testes de interface para avançar, voltar, editar, pular, apagar e restaurar;
- testes de respostas inválidas, timeout, ausência de rede e indisponibilidade de armazenamento;
- abrir o mesmo DOCX no LibreOffice, caso esse leitor entre na matriz suportada;
- testar navegadores desktop e mobile definidos como alvo;
- avaliar narrativa real com dados fictícios e um provedor/chave de teste com custo controlado.

Cada rodada deve registrar ambiente, navegador, provedor/modelo quando aplicável, resultado observado e pendências. Não colocar respostas pessoais em logs, capturas de tela ou fixtures.

## Próxima fatia de implementação

Próximo: executar o protocolo com os provedores usando dados inteiramente fictícios, incluindo notas complementares e lacunas deliberadas para confirmar que a IA não inventa detalhes. Isso requer uma chave de API de teste fornecida pelo responsável; sem ela, não há como produzir saídas reais ou registrar custo. Registrar modelo, respostas e revisão editorial; não divulgar qualidade validada antes dessa avaliação. Depois, executar a suíte local, verificar fluxos de falha e realizar teste moderado. A refatoração modular continua depois que o fluxo de livro for confiável.

## Decisões ainda abertas

- O projeto será apenas uma demonstração/uso individual, ou pretende receber usuários públicos sem chave própria?
- A recuperação local deve persistir indefinidamente até exclusão manual, ou expirar após um prazo configurável?
- Fotos e capa precisam sobreviver ao fechamento do navegador, aceitando maior uso de armazenamento?
- Quais leitores de DOCX e navegadores são os alvos obrigatórios?

As perguntas acima não bloqueiam as fases P0 e P1; devem ser respondidas antes de alterar o modelo de hospedagem ou prometer persistência de imagens.
