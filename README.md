# estudos-ia-vunesp
Simulador de questões inéditas da banca Vunesp utilizando Llama 3.3 (Groq), persistência de dados no Supabase e dashboard analítico em tempo real no Power BI Mobile.
📁 estudos-ai-vunesp/
├── 📁 .github/                  # Configurações do GitHub (opcional)
│   └── workflow.yml
├── 📁 src/                      # Código-fonte do simulador (Google Apps Script)
│   ├── Código.gs                # Regras de negócio, conexão JDBC e integração Groq/Gemini
│   └── Index.html               # Interface web responsiva (HTML/CSS/JS)
├── 📁 database/                 # Modelagem do Banco de Dados (Supabase)
│   └── schema.sql               # Script SQL de criação da tabela 'resultados' e RLS
├── 📁 power-bi/                 # Pasta do Relatório de Desempenho
│   └── EstudosAI.pbix           # Arquivo do relatório Power BI Desktop
├── 📄 .gitignore                # Arquivo para ignorar arquivos desnecessários
├── 📄 LICENSE                   # Licença do projeto (ex: MIT)
└── 📄 README.md                 # Apresentação, passo a passo de instalação e prints
