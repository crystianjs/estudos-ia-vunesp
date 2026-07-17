/**
 * SISTEMA DE ESTUDOS PESSOAL - BACKEND (Código.gs)
 * Versão: Calibrada com Engenharia Reversa do QConcursos (Banca Vunesp)
 * Integração: Llama 3.3 70b (Groq Engine) & Supabase
 */

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('EstudosAI - Simulados Vunesp')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getGroqApiKey() {
  return PropertiesService.getScriptProperties().getProperty('GROQ_API_KEY') || "";
}

function obterConexaoBanco() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const host = scriptProperties.getProperty('DB_HOST');
  const port = scriptProperties.getProperty('DB_PORT') || "5432";
  const dbName = scriptProperties.getProperty('DB_NAME') || "postgres";
  const user = scriptProperties.getProperty('DB_USER') || "postgres";
  const password = scriptProperties.getProperty('DB_PASSWORD');

  if (!host || !password) {
    Logger.log("Credenciais do Supabase não configuradas. O progresso será registado apenas localmente.");
    return null;
  }

  try {
    const dbUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName;
    return Jdbc.getConnection(dbUrl, user, password);
  } catch (e) {
    Logger.log("Falha ao tentar conectar ao Supabase: " + e.message);
    return null;
  }
}

/**
 * Embaralha as alternativas associando o gabarito textual de forma infalível
 */
function m_embaralharQuestoes(rawQuestao) {
  const itens = [
    { texto: rawQuestao.correta, tipo: "correta" },
    { texto: rawQuestao.incorreta1, tipo: "incorreta" },
    { texto: rawQuestao.incorreta2, tipo: "incorreta" },
    { texto: rawQuestao.incorreta3, tipo: "incorreta" },
    { texto: rawQuestao.incorreta4, tipo: "incorreta" }
  ];

  for (let i = itens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = itens[i];
    itens[i] = itens[j];
    itens[j] = temp;
  }

  let letraCorreta = "A";
  const letras = ["A", "B", "C", "D", "E"];
  
  itens.forEach((item, index) => {
    if (item.tipo === "correta") {
      letraCorreta = letras[index];
    }
  });

  return {
    enunciado: rawQuestao.enunciado,
    alternativa_a: itens[0].texto,
    alternativa_b: itens[1].texto,
    alternativa_c: itens[2].texto,
    alternativa_d: itens[3].texto,
    alternativa_e: itens[4].texto,
    correta: letraCorreta,
    dica: rawQuestao.dica
  };
}

/**
 * Conexão com o Groq Engine (Llama 3.3 70B)
 */
function chamarGroqAPI(prompt, requerJson) {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error("Chave de API (GROQ_API_KEY) não encontrada nas propriedades do seu projeto.");
  }

  const url = "https://api.groq.com/openai/v1/chat/completions";
  
  const systemPrompt = requerJson 
    ? "Você é uma inteligência artificial especialista em concursos públicos e analista sênior de questões de exames nacionais. Seu papel é fazer engenharia reversa das questões reais da banca Vunesp presentes no acervo QConcursos. Retorne estritamente um JSON limpo, sem nenhuma formatação markdown."
    : "Você é um professor de cursinho preparatório especialista em aprovação na banca Vunesp, focado em comentários analíticos de alto nível.";

  const payload = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  };

  if (requerJson) {
    payload.response_format = { type: "json_object" };
  }

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { "Authorization": "Bearer " + apiKey },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const contentText = response.getContentText();
    const json = JSON.parse(contentText);

    if (responseCode !== 200) {
      if (json.error && json.error.message) {
        throw new Error("API Groq Erro (" + responseCode + "): " + json.error.message);
      }
      throw new Error("Erro no servidor Groq: " + responseCode);
    }

    if (json.choices && json.choices[0].message && json.choices[0].message.content) {
      return json.choices[0].message.content;
    } else {
      throw new Error("Resposta inválida recebida do Groq.");
    }
  } catch (e) {
    throw new Error(e.message);
  }
}

/**
 * Gera questões inéditas utilizando a modelagem estatística de questões reais da banca Vunesp (Padrão QConcursos)
 */
function gerarESalvarNovaQuestao(disciplina, assunto, instrucoes) {
  const uniqueSalt = Math.floor(Math.random() * 1000000);

  const prompt = "Gere uma única questão inédita de múltipla escolha idêntica às questões reais mais resolvidas da banca Fundação VUNESP no acervo QConcursos.\n" +
                 "- Disciplina/Matéria: \"" + disciplina + "\"\n" +
                 "- Assunto específico: \"" + assunto + "\"\n" +
                 "- Instruções adicionais de formato: \"" + (instrucoes || "Nenhuma") + "\"\n" +
                 "- Identificador de Variação Único: " + uniqueSalt + "\n\n" +
                 "MODELAGEM DE QUESTÕES VUNESP (ESTILO QCONCURSOS):\n" +
                 "1. ENUNCIADOS:\n" +
                 "   - Em Língua Portuguesa: Crie enunciados diretos focados em norma-padrão como 'Assinale a alternativa em que o emprego do sinal indicativo de crase...' ou use pequenos textos jornalísticos com lacunas para serem preenchidas ('Complete a lacuna...').\n" +
                 "   - Em Direito / Legislação: Crie cenários práticos ou cobre a exata literalidade jurídica da lei seca (Vunesp adora trocar um ou dois termos da lei para confundir).\n" +
                 "2. QUALIDADE DAS ALTERNATIVAS:\n" +
                 "   - Apresente exatamente 5 alternativas por extenso (A, B, C, D e E).\n" +
                 "   - É terminantemente PROIBIDO colocar termos curtos, palavras isoladas ou letras soltas nas chaves de alternativas.\n" +
                 "   - Os distratores (opções incorretas) devem ser extremamente plausíveis, cobrando as exceções clássicas da gramática ou pegadinhas de lei da Vunesp.\n" +
                 "3. DICA/COMENTÁRIO:\n" +
                 "   - A dica deve atuar como os comentários de professores mais curtidos no QConcursos: explicando cirurgicamente o porquê de cada alternativa estar certa ou errada.\n\n" +
                 "Retorne estritamente um objeto JSON com esta estrutura (sem blocos de código markdown como ```json):\n" +
                 "{\n" +
                 "  \"enunciado\": \"[Escreva o enunciado formal inédito padrão QConcursos aqui. Se usar aspas por dentro, utilize aspas simples (').]\",\n" +
                 "  \"correta\": \"[Texto completo da alternativa correta]\",\n" +
                 "  \"incorreta1\": \"[Texto completo da primeira alternativa incorreta]\",\n" +
                 "  \"incorreta2\": \"[Texto completo da segunda alternativa incorreta]\",\n" +
                 "  \"incorreta3\": \"[Texto completo da terceira alternativa incorreta]\",\n" +
                 "  \"incorreta4\": \"[Texto completo da quarta alternativa incorreta]\",\n" +
                 "  \"dica\": \"[Explicação analítica profunda baseada na norma-padrão ou legislação para fundamentar a correta e o erro de cada uma das incorretas]\"\n" +
                 "}";

  try {
    const respostaGroq = chamarGroqAPI(prompt, true);
    const questaoJson = JSON.parse(respostaGroq.trim());
    return m_embaralharQuestoes(questaoJson);
  } catch (e) {
    Logger.log("Erro ao gerar questão calibrada pelo QConcursos no Groq: " + e.message);
    throw new Error(e.message);
  }
}

/**
 * Chat síncrono com o Tutor inteligente durante a resolução
 */
function conversarComGemini(questaoCompleta, perguntaUsuario) {
  const prompt = "O aluno está resolvendo uma questão no padrão VUNESP:\n" +
                 "Questão: \"" + questaoCompleta.enunciado + "\"\n" +
                 "- Alternativa A: \"" + questaoCompleta.alternativa_a + "\"\n" +
                 "- Alternativa B: \"" + questaoCompleta.alternativa_b + "\"\n" +
                 "- Alternativa C: \"" + questaoCompleta.alternativa_c + "\"\n" +
                 "- Alternativa D: \"" + questaoCompleta.alternativa_d + "\"\n" +
                 "- Alternativa E: \"" + questaoCompleta.alternativa_e + "\"\n" +
                 "- Gabarito: \"" + questaoCompleta.correta + "\"\n\n" +
                 "Dúvida do aluno:\n" +
                 "\"" + perguntaUsuario + "\"\n\n" +
                 "Atue como um professor especialista na banca Vunesp, no mesmo nível dos melhores professores do QConcursos. Responda de forma didática, direta e formal. Explique por que a correta está certa e os erros sutis que tornam as outras alternativas erradas.";

  try {
    return chamarGroqAPI(prompt, false);
  } catch (e) {
    return "Tive uma falha temporária ao processar sua dúvida. Por favor, tente enviar novamente.";
  }
}

function salvarResultado(materia, acertou) {
  try {
    const conn = obterConexaoBanco();
    if (conn) {
      const sql = "INSERT INTO resultados (materia, acertou, data_criacao) VALUES (?, ?, CURRENT_TIMESTAMP)";
      const stmt = conn.prepareStatement(sql);
      stmt.setString(1, materia);
      stmt.setBoolean(2, acertou);
      stmt.execute();
      stmt.close();
      conn.close();
    }
  } catch (e) {
    Logger.log("Erro ao salvar resultado no Supabase: " + e.message);
  }
  return { sucesso: true };
}
