# <p align="center"><font color="#E0533C">estudos-ia-vunesp</font></p>

<p align="center">
  <strong>Simulador de questões inéditas da banca Vunesp utilizando Llama 3.3 (Groq), persistência de dados no Supabase e dashboard analítico em tempo real no Streamlit (Mobile & Desktop).</strong>
  <br><em>(Nota: Integração legada via Power BI descontinuada para consolidação da arquitetura nativa em Streamlit).</em>
</p>

---

## <font color="#E0533C">📁 Estrutura do Repositório</font>

```text
📁 estudos-ia-vunesp (Raiz do seu GitHub)
└── 📁 estudos-ia-vunesp/            # Pasta principal do projeto
    ├── 📁 .github/                  # Configurações do GitHub
    │   └── workflow.yml
    ├── 📁 Database/                 # Modelagem do Banco de Dados
    │   └── schema.sql               
    ├── 📁 Src/                      # Código-fonte do simulador e dashboard
    │   ├── 📁 Backend/              # Scripts de backend (Google Apps Script)
    │   │   └── codigo.gs            
    │   ├── 📁 Frontend/             # Interface web do simulador
    │   │   └── index.html           
    │   └── app.py                   # Código-fonte do Dashboard Analytics (Streamlit)
    └── 📁 escopo/                   # Planejamento e Documentação do Projeto
        └── EstudosIA - Escopo de Projeto.pdf # Apresentação executiva em PDF
