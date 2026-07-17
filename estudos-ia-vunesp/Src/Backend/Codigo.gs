<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <base target="_top">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EstudosAI - Simulados Vunesp</title>
  
  <link href="[https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css](https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css)" rel="stylesheet">
  <link href="[https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css)" rel="stylesheet">
  
  <style>
    /* DESIGN REFINADO: VERMELHO, PRETO E BRANCO */
    :root {
      --bg-dark-color: #0b0c10;
      --card-bg-color: #12131a;
      --accent-color: #ff3203;       /* Vermelho Principal */
      --accent-hover-color: #d62700; /* Vermelho Hover */
      --text-main-color: #ffffff;
      --text-muted-color: #a0aec0;
      --border-color: #1f222e;
    }


    body {
      background-color: var(--bg-dark-color);
      color: var(--text-main-color);
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-bottom: 40px;
    }

    header {
      text-align: center;
      margin: 40px 0 30px;
      width: 100%;
    }

    header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    header h1 span {
      color: var(--accent-color);
    }

    header p {
      color: var(--text-muted-color);
      font-size: 0.95rem;
    }
    
    div .card-glass h1 span {
      color: var(--accent-color);
    }

    textarea, input, select {
  font-family: inherit;
}


    .card-glass {
      background-color: var(--card-bg-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(212, 0, 0, 0.5);
      width: 100%;
      box-sizing: border-box;
    }

    .form-label {
      color: #fff;
      font-weight: 600;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 9px;
    }

    .form-control, .form-select {
      background-color: #171923 !important;
      border: 1px solid var(--border-color) !important;
      color: var(--text-main-color) !important;
      border-radius: 8px;
      padding: 12px 15px;
      width: 100% !important;
      box-sizing: border-box;
    }

    .form-control:focus, .form-select:focus {
      border-color: var(--accent-color) !important;
      box-shadow: 0 0 0 3px rgba(255, 50, 3, 0.2) !important;
    }

    div .mb-4 {
      margin-bottom: 20px;
    }

    /* BOTÕES */
    .btn-red {
      background-color: var(--accent-color);
      color: white;
      font-weight: 700;
      border: none;
      padding: 14px;
      border-radius: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.2s ease-in-out;
      width: 100%;
      margin-top: 15px;
    }

    .btn-red:hover {
      background-color: var(--accent-hover-color);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 50, 3, 0.4);
      color: white;
    }

    /* ELEMENTOS DA QUESTÃO */
    .enunciado-caixa {
      background-color: #171923;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
      line-height: 1.6;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .alternativa-btn {
      background-color: #171923;
      border: 1px solid var(--border-color);
      color: var(--text-main-color);
      border-radius: 8px;
      padding: 15px 20px;
      text-align: left;
      width: 100%;
      margin-bottom: 12px;
      transition: all 0.2s;
      font-weight: 500;
      line-height: 1.5;
    }

    .alternativa-btn:hover:not(:disabled) {
      background-color: #1e2130;
      border-color: var(--accent-color);
    }

    .alternativa-btn.correta {
      background-color: rgba(46, 213, 115, 0.15) !important;
      border-color: #2ed573 !important;
      color: #2ed573 !important;
    }

    .alternativa-btn.errada {
      background-color: rgba(255, 50, 3, 0.15) !important;
      border-color: var(--accent-color) !important;
      color: var(--accent-color) !important;
    }

    /* TUTOR / CHAT */
    .tutor-section {
      border-top: 1px solid var(--border-color);
      margin-top: 25px;
      padding-top: 25px;
    }

    .chat-box {
      background-color: #0b0c10;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 15px;
      height: 200px;
      overflow-y: auto;
      margin-bottom: 15px;
    }

    .mensagem {
      margin-bottom: 12px;
      line-height: 1.5;
    }

    .mensagem.usuario {
      color: #718096;
    }

    .mensagem.tutor {
      color: var(--text-main-color);
      border-left: 3px solid var(--accent-color);
      padding-left: 10px;
    }

    .placar {
      display: flex;
      justify-content: space-around;
      margin-bottom: 25px;
    }

    .placar-box {
      background-color: #171923;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      width: 45%;
    }

    .placar-box.acertos h4 { color: #2ed573; font-weight: 700; }
    .placar-box.erros h4 { color: var(--accent-color); font-weight: 700; }

    .loader {
      display: none;
      text-align: center;
      padding: 40px;
    }

    .loader i {
      color: var(--accent-color);
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }


  </style>
</head>
<body>
    <body>

  <!-- O restante do seu código atual continua aqui para baixo... -->


  <div class="container" style="max-width: 650px; width: 100%;">

    
    <header>
      <h1>Estudos<span>IA</span></h1>
      <p>Simulados Customizados • Padrão VUNESP</p>
    </header>

    <div id="setup-screen" class="card-glass">
      <h1 class="mb-4 text-center fw-bold">Configurar <span>Simulado</span></h1>
      
      <div class="mb-4">
        <label class="form-label">Disciplina (Edital)</label>
        <select id="materia-input" class="form-select">
          <option value="" disabled selected>-- Clique para Escolher uma Matéria --</option>
          <option value="Língua Portuguesa">Língua Portuguesa</option>
          <option value="Direito Constitucional">Direito Constitucional</option>
          <option value="Direito Administrativo">Direito Administrativo</option>
          <option value="Direito Penal">Direito Penal</option>
          <option value="Direito Processual Penal">Direito Processual Penal</option>
          <option value="Direito Processual Civil">Direito Processual Civil</option>
          <option value="Legislação Interna">Legislação Interna</option>
          <option value="Matemática">Matemática</option>
          <option value="Raciocínio Lógico">Raciocínio Lógico</option>
          <option value="Informática">Informática</option>
          <option value="Atualidades">Atualidades</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="form-label">Quantidade de Questões</label>
        <input type="number" id="qtdQuestoes" min="1" max="10" value="1" class="form-control">
      </div>

      <div class="mb-4">
        <label class="form-label">Assunto Específico (Opcional)</label>
        <input type="text" id="assunto-input" class="form-control" placeholder="Ex: Crase, Concordância, Artigo 5.º...">
      </div>

      <div class="mb-4">
        <label class="form-label">Diretrizes Adicionais da IA</label>
        <textarea id="instrucao-input" class="form-control" rows="3" placeholder="Ex: Focar na literalidade de leis do TJ-SP ou regras gramaticais estritas..."></textarea>
      </div>

      <button onclick="iniciarQuiz()" class="btn-red">
        Gerar Questões Vunesp <i class="fa-solid fa-wand-magic-sparkles ms-1"></i>
      </button>
    </div>

    <div id="loader-screen" class="loader card-glass">
      <i class="fa-solid fa-circle-notch fa-3x mb-3"></i>
      <h5 id="texto-loader">O motor de IA está a formular as suas questões...</h5>
      <p class="text-muted small">Gerando com modelo Llama 3.3 70B de alta precisão pedagógica.</p>
    </div>

    <div id="quiz-screen" class="card-glass" style="display: none;">
      
      <div class="placar">
        <div class="placar-box acertos">
          <span class="small text-muted">ACERTOS</span>
          <h4 id="contador-acertos">0</h4>
        </div>
        <div class="placar-box erros">
          <span class="small text-muted">ERROS</span>
          <h4 id="contador-erros">0</h4>
        </div>
      </div>

      <div class="mb-3 text-muted fw-bold small" id="contador-questoes-progresso">QUESTÃO 1 DE 1</div>

      <div id="enunciado-container" class="enunciado-caixa"></div>

      <div id="alternativas-container"></div>

      <div id="feedback-resposta" class="mt-3 p-3 rounded" style="display: none; font-weight: 600;"></div>

      <div class="tutor-section" id="tutor-container" style="display: none;">
        <h5 class="fw-bold mb-3"><i class="fa-solid fa-robot text-danger me-2"></i>Tutor do Simulado</h5>
        
        <div class="chat-box" id="chat-box">
          <div class="mensagem tutor">Olá! Responda à questão acima ou envie uma dúvida para que eu possa explicar os detalhes!</div>
        </div>

        <div class="input-group">
          <input type="text" id="chat-input" class="form-control" placeholder="Tire a sua dúvida sobre a matéria...">
          <button class="btn btn-red px-4" style="width: auto; margin-top: 0;" onclick="enviarMensagemChat()">Perguntar</button>
        </div>
      </div>

      <button id="btn-proxima" class="btn-red mt-4" style="display: none;" onclick="proximaQuestao()">
        Próxima Questão <i class="fa-solid fa-arrow-right ms-2"></i>
      </button>
    </div>

  </div>

  <script>
    const quizState = {
      materia: "",
      assunto: "",
      instrucao: "",
      acertos: 0,
      erros: 0,
      listaQuestoes: [],
      indiceAtual: 0,
      respondida: false
    };

    function iniciarQuiz() {
      const materiaSelect = document.getElementById('materia-input');
      const materiaVal = materiaSelect.value;
      let assuntoVal = document.getElementById('assunto-input').value.trim();
      const instrucaoVal = document.getElementById('instrucao-input').value.trim();
      const qtdQuestoes = parseInt(document.getElementById('qtdQuestoes').value) || 1;

      if (!materiaVal) {
        alert("Por favor, selecione uma Disciplina do edital!");
        return;
      }

      if (!assuntoVal) {
        assuntoVal = "Conhecimentos gerais da matéria";
      }

      quizState.materia = materiaVal;
      quizState.assunto = assuntoVal;
      quizState.instrucao = instrucaoVal;
      quizState.acertos = 0;
      quizState.erros = 0;
      quizState.listaQuestoes = [];
      quizState.indiceAtual = 0;

      document.getElementById('contador-acertos').innerText = "0";
      document.getElementById('contador-erros').innerText = "0";

      carregarLoteQuestoes(qtdQuestoes);
    }

    function carregarLoteQuestoes(total) {
      mostrarTela('loader-screen');
      quizState.listaQuestoes = [];
      let carregadas = 0;

      function obterProximaQuestaoDaFila() {
        if (carregadas >= total) {
          exibirQuestaoAtual();
          mostrarTela('quiz-screen');
          return;
        }

        document.getElementById('texto-loader').innerHTML = `
          O motor de IA está a formular as questões padrão Vunesp... <br>
          <span class="fs-5 mt-2 d-inline-block text-danger">Processando questão <strong>${carregadas + 1} de ${total}</strong>...</span>
        `;

        google.script.run
          .withSuccessHandler(function(questao) {
            if (questao && questao.enunciado) {
              quizState.listaQuestoes.push(questao);
              carregadas++;
              
              setTimeout(function() {
                obterProximaQuestaoDaFila();
              }, 200);
            } else {
              falharComErroLogico("A IA gerou um formato de resposta vazio ou incompleto.");
            }
          })
          .withFailureHandler(function(erro) {
            const erroMsg = (erro && erro.message) ? erro.message : (erro ? String(erro) : "Falha desconhecida");
            falharComErroLogico(erroMsg);
          })
          .gerarESalvarNovaQuestao(quizState.materia, quizState.assunto, quizState.instrucao);
      }

      function falharComErroLogico(mensagem) {
        document.getElementById('texto-loader').innerHTML = `
          <span class="text-danger fw-bold"><i class="fa-solid fa-triangle-exclamation me-2"></i>Erro ao Gerar Questão!</span><br>
          <span class="small text-white d-inline-block mt-2 bg-dark p-2 rounded text-start" style="font-family: monospace; max-width: 90%; word-break: break-all;">${mensagem}</span><br>
          <button class="btn btn-sm btn-red px-3 mt-3" style="width: auto;" onclick="mostrarTela('setup-screen')">Voltar ao Menu</button>
        `;
      }

      obterProximaQuestaoDaFila();
    }

    function exibirQuestaoAtual() {
      quizState.respondida = false;
      const questao = quizState.listaQuestoes[quizState.indiceAtual];
      
      document.getElementById('feedback-resposta').style.display = 'none';
      document.getElementById('btn-proxima').style.display = 'none';
      document.getElementById('tutor-container').style.display = 'none';
      document.getElementById('chat-box').innerHTML = '<div class="mensagem tutor">Olá! Responda à questão acima ou envie uma dúvida para que eu possa explicar os detalhes!</div>';
      
      document.getElementById('contador-questoes-progresso').innerText = `QUESTÃO ${quizState.indiceAtual + 1} DE ${quizState.listaQuestoes.length}`;
      
      renderizarQuestao(questao);
    }

    function renderizarQuestao(questao) {
      document.getElementById('enunciado-container').innerHTML = questao.enunciado;
      const container = document.getElementById('alternativas-container');
      container.innerHTML = "";

      const letras = ["A", "B", "C", "D", "E"];
      const alternativas = [
        questao.alternativa_a,
        questao.alternativa_b,
        questao.alternativa_c,
        questao.alternativa_d,
        questao.alternativa_e
      ];

      alternativas.forEach((texto, i) => {
        if (texto) {
          const btn = document.createElement('button');
          btn.className = 'alternativa-btn';
          btn.id = 'alt-' + letras[i];
          btn.innerHTML = `<strong>${letras[i]})</strong> ${texto}`;
          btn.onclick = function() { responder(letras[i]); };
          container.appendChild(btn);
        }
      });
    }

    function responder(letraEscolhida) {
      if (quizState.respondida) return;
      quizState.respondida = true;

      const questao = quizState.listaQuestoes[quizState.indiceAtual];
      const gabarito = questao.correta;
      const feedback = document.getElementById('feedback-resposta');
      
      const letras = ["A", "B", "C", "D", "E"];
      letras.forEach(l => {
        const el = document.getElementById('alt-' + l);
        if (el) el.disabled = true;
      });

      let acertou = false;

      if (letraEscolhida === gabarito) {
        document.getElementById('alt-' + letraEscolhida).classList.add('correta');
        feedback.className = "mt-3 p-3 rounded bg-success-subtle text-success border border-success";
        feedback.innerHTML = "🎉 Resposta Correta!";
        quizState.acertos++;
        document.getElementById('contador-acertos').innerText = quizState.acertos;
        acertou = true;
      } else {
        document.getElementById('alt-' + letraEscolhida).classList.add('errada');
        document.getElementById('alt-' + gabarito).classList.add('correta');
        feedback.className = "mt-3 p-3 rounded bg-danger-subtle text-danger border border-danger";
        feedback.innerHTML = `❌ Resposta Errada! A resposta correta é a alternativa <strong>${gabarito}</strong>.`;
        quizState.erros++;
        document.getElementById('contador-erros').innerText = quizState.erros;
      }

      feedback.style.display = 'block';
      
      const btnProxima = document.getElementById('btn-proxima');
      if (quizState.indiceAtual < quizState.listaQuestoes.length - 1) {
        btnProxima.innerHTML = `Próxima Questão <i class="fa-solid fa-arrow-right ms-2"></i>`;
      } else {
        btnProxima.innerHTML = `Finalizar Simulado <i class="fa-solid fa-check-double ms-2"></i>`;
      }
      btnProxima.style.display = 'block';
      document.getElementById('tutor-container').style.display = 'block';

      google.script.run.salvarResultado(quizState.materia, acertou);
    }

    function enviarMensagemChat() {
      const input = document.getElementById('chat-input');
      const msg = input.value.trim();
      if (!msg) return;

      const chatBox = document.getElementById('chat-box');
      chatBox.innerHTML += `<div class="mensagem usuario"><strong>Você:</strong> ${msg}</div>`;
      input.value = "";
      chatBox.scrollTop = chatBox.scrollHeight;

      const idTemp = "temp-" + Date.now();
      chatBox.innerHTML += `<div class="mensagem tutor" id="${idTemp}"><em>O Tutor está a analisar a sua pergunta...</em></div>`;
      chatBox.scrollTop = chatBox.scrollHeight;

      const questao = quizState.listaQuestoes[quizState.indiceAtual];

      google.script.run
        .withSuccessHandler(function(respostaTutor) {
          const elementoTemp = document.getElementById(idTemp);
          if (elementoTemp) {
            elementoTemp.innerHTML = `<strong>Tutor:</strong><br>${respostaTutor.replace(/\n/g, '<br>')}`;
          }
          chatBox.scrollTop = chatBox.scrollHeight;
        })
        .withFailureHandler(function(erro) {
          const elementoTemp = document.getElementById(idTemp);
          if (elementoTemp) {
            elementoTemp.innerHTML = `<strong>Erro:</strong> Não consegui processar a sua dúvida. Tente novamente.`;
          }
        })
        .conversarComGemini(questao, msg);
    }

    function proximaQuestao() {
      if (quizState.indiceAtual < quizState.listaQuestoes.length - 1) {
        quizState.indiceAtual++;
        exibirQuestaoAtual();
      } else {
        alert(`Fim do simulado! Teve ${quizState.acertos} acerto(s) e ${quizState.erros} erro(s).`);
        mostrarTela('setup-screen');
      }
    }

    function mostrarTela(idTela) {
      document.getElementById('setup-screen').style.display = 'none';
      document.getElementById('loader-screen').style.display = 'none';
      document.getElementById('quiz-screen').style.display = 'none';
      document.getElementById(idTela).style.display = 'block';
    }
  </script>
</body>
</html>
