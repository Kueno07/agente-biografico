# Avaliação editorial: Groq GPT-OSS 120B

**Data:** 2026-10-20
**Provedor:** Groq
**Modelo configurado:** `openai/gpt-oss-120b`
**Idioma:** português do Brasil
**Limite da chamada:** `max_tokens=2200`; temperatura não definida pelo app (padrão do provedor)
**Dados:** casos inteiramente fictícios do protocolo do projeto
**Custo exibido pelo provedor:** não conferido
**Método:** execução da função real `generateNarrative` do app contra a API Groq. A chave foi mantida apenas em memória durante a chamada e não foi registrada neste relatório.

## Caso 1: mudança de cidade

### Saída original

> Eu tinha uns onze anos quando deixei São Paulo e fui para Curitiba com a minha mãe. Não lembro o mês, mas foi por volta de 1998. O pai ficou na capital; não lembro de nenhuma despedida.
>
> Nos primeiros dias, eu e minha mãe pegávamos o ônibus para a escola. Saíamos bem cedo, mas não sei o número da linha nem quanto tempo a viagem levava. Eu ficava olhando pela janela, sem saber exatamente o que sentia. Levei uma mochila vermelha e lembro do cheiro de chuva impregnado no casaco que eu usava.
>
> A rotina da primeira semana se resumiu a esses trajetos, ao ritmo de acordar, embarcar e chegar à escola, sem grandes marcas além da mochila, da chuva e da paisagem que passava pela janela.

### Pontuação preliminar

| Dimensão | Nota | Evidência |
|---|---:|---|
| Fidelidade factual | 1/2 | Preserva mudança, ano aproximado e lacunas, mas transforma “lembro de uma mochila” em “levei uma mochila” e acrescenta uma descrição da rotina. |
| Incerteza | 2/2 | Mantém o ano como aproximação, não inventa mês e preserva a ausência de lembrança de despedida. |
| Uso da nota | 2/2 | Omite corretamente a caixa sem tratá-la como prova. |
| Voz e perspectiva | 1/2 | Mantém primeira pessoa, mas acrescenta a interpretação de que esses eram os únicos marcos da semana. |
| Forma narrativa | 1/2 | Coeso, porém o último parágrafo amplia além do material fornecido. |
| Prosa sem clichês | 2/2 | Não inclui moral ou clichê edificante. |
| **Total** | **9/12** | Sem falha grave definida no protocolo; há acréscimos factuais que exigem revisão. |

## Caso 2: trabalho na padaria

### Saída original

> Comecei a trabalhar na padaria do meu tio ainda adolescente. Acho que tinha quinze anos, embora a minha prima me tenha lembrado em mensagem que eu já tinha dezesseis. No balcão eu atendia os clientes, e nas entregas eu saía pela rua de trás, carregando as sacolas de pão. O nome da padaria ainda me escapa um pouco; às vezes lembro de “Pão da Praça”, outras vezes de “Pão da Praça Nova”. Um papel antigo que encontrei, sem data, traz apenas a frase “Pão da Praça”.
>
> Uma manhã o forno simplesmente parou. Meu tio me pediu que chamasse um técnico, e eu saí pelo portão com a chave que eu achava que serviria para a máquina – mas, na prática, ela não servia. Não lembro nem o dia da semana nem se o conserto foi concluído naquele mesmo dia.
>
> Esses detalhes permanecem um tanto confusos: a idade exata quando comecei, o nome preciso da padaria e o desenrolar completo daquele incidente com o forno. Mesmo com o papel e a mensagem da prima, as dúvidas continuam, mas são parte da memória daquele período.

### Pontuação preliminar

| Dimensão | Nota | Evidência |
|---|---:|---|
| Fidelidade factual | 0/2 | Inventa atendimento a clientes, sacolas de pão e que a pessoa acreditava que a chave serviria. |
| Incerteza | 2/2 | Mantém dúvidas sobre idade, nome e conclusão do conserto. |
| Uso da nota | 1/2 | Cita o papel, mas sua formulação o aproxima de evidência para o nome, embora a dúvida continue explícita. |
| Voz e perspectiva | 1/2 | Primeira pessoa preservada, com afirmações e detalhes não fornecidos. |
| Forma narrativa | 1/2 | Organizado, mas acrescenta uma conclusão reflexiva que o material não sustenta. |
| Prosa sem clichês | 2/2 | Não usa lição moral ou linguagem de superação. |
| **Total** | **7/12** | **Falha grave:** inventa rotina de trabalho e a crença sobre a chave, ambas explicitamente vedadas pelo protocolo. |

## Conclusão

As duas chamadas foram concluídas com respostas válidas. O modelo preservou várias incertezas, mas acrescentou detalhes plausíveis como se fossem lembranças. O segundo caso falha no critério de fidelidade e impede recomendar esta configuração para redigir capítulos sem revisão humana linha a linha.

Esta pontuação é uma avaliação editorial preliminar feita durante a execução técnica. Ainda falta uma leitura humana independente e a conferência do custo/uso no painel Groq. O teste usa somente exemplos fictícios; não demonstra qualidade com histórias reais nem substitui revisão do manuscrito.
