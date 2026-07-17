import streamlit as st
import pandas as pd
import psycopg2
import os

# Configuração da página para visualização mobile e desktop
st.set_page_config(
    page_title="EstudosIA - Painel de Desempenho", 
    page_icon="📊", 
    layout="centered"
)

# Estilização Neon Dark Personalizada (EstudosIA)
st.markdown("""
    <style>
    /* Cor de fundo do aplicativo */
    .stApp {
        background-color: #090d16;
    }
    
    /* Configuração dos Cards de Métricas com brilho neon */
    .metric-box {
        background-color: #111422;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        border: 1px solid rgba(255, 69, 0, 0.2);
        box-shadow: 0 0 15px rgba(255, 69, 0, 0.1);
        margin-bottom: 15px;
    }
    .metric-title { 
        color: #94a3b8; 
        font-size: 14px; 
        font-weight: 500;
        margin-bottom: 5px; 
    }
    .metric-value { 
        color: #ff4500; 
        font-size: 32px; 
        font-weight: bold; 
        text-shadow: 0 0 10px rgba(255, 69, 0, 0.3);
    }
    
    /* Destaque especial em Verde Neon para a Taxa de Aproveitamento */
    .metric-box-green {
        background-color: #111422;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        border: 1px solid rgba(0, 255, 102, 0.2);
        box-shadow: 0 0 15px rgba(0, 255, 102, 0.1);
        margin-bottom: 15px;
    }
    .metric-value-green { 
        color: #00ff66; 
        font-size: 32px; 
        font-weight: bold; 
        text-shadow: 0 0 10px rgba(0, 255, 102, 0.4);
    }
    
    /* Customização dos Títulos */
    h1, h2, h3, h4, h5, h6 {
        color: #ffffff !important;
        font-family: 'Poppins', sans-serif;
    }
    
    /* Subtítulos */
    .stMarkdown p {
        color: #94a3b8;
    }
    
    /* Elementos da barra lateral */
    section[data-testid="stSidebar"] {
        background-color: #111422 !important;
        border-right: 1px solid rgba(255, 69, 0, 0.15);
    }
    </style>
""", unsafe_allow_html=True)

st.title("📊 Painel de Desempenho Acadêmico")
st.caption("Filtros avançados e análise simplificada por período e disciplina.")

# Função para ler os dados do Supabase
def carregar_dados():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )
    query = "SELECT materia, acertou, data_criacao FROM resultados;"
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

try:
    df = carregar_dados()
    
    if not df.empty:
        # Tratamento das datas para permitir filtros de mês
        df['data_criacao'] = pd.to_datetime(df['data_criacao'])
        
        # Mapeamento de meses para o português
        meses_map = {
            1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril",
            5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto",
            9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro"
        }
        df['Mes_Num'] = df['data_criacao'].dt.month
        df['Mês'] = df['Mes_Num'].map(meses_map)

        # 🎯 BARRA LATERAL (FILTROS 100% EM PORTUGUÊS)
        st.sidebar.markdown("<h2 style='color:#ff4500; font-size:22px; text-shadow: 0 0 8px rgba(255,69,0,0.3);'>🎯 Filtros</h2>", unsafe_allow_html=True)
        
        meses_disponiveis = ["Todos"] + sorted(list(df['Mês'].dropna().unique()), key=lambda m: list(meses_map.values()).index(m))
        mes_selecionado = st.sidebar.selectbox("📅 Escolha o Mês", meses_disponiveis)
        
        materias_disponiveis = ["Todas"] + sorted(list(df['materia'].unique()))
        materia_selecionada = st.sidebar.selectbox("📚 Escolha a Matéria", materias_disponiveis)

        # Aplicando filtros de forma dinâmica
        df_filtrado = df.copy()
        if mes_selecionado != "Todos":
            df_filtrado = df_filtrado[df_filtrado['Mês'] == mes_selecionado]
        if materia_selecionada != "Todas":
            df_filtrado = df_filtrado[df_filtrado['materia'] == materia_selecionada]

        # Recálculo das métricas com base no filtro ativo
        total_questoes = len(df_filtrado)
        total_acertos = df_filtrado[df_filtrado['acertou'] == True].shape[0]
        total_erros = df_filtrado[df_filtrado['acertou'] == False].shape[0]
        taxa_acerto = (total_acertos / total_questoes) * 100 if total_questoes > 0 else 0

        # 📱 Exibição dos cartões de métricas em português
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.markdown(f'<div class="metric-box"><div class="metric-title">Respondidas</div><div class="metric-value">{total_questoes}</div></div>', unsafe_allow_html=True)
        with col2:
            st.markdown(f'<div class="metric-box"><div class="metric-title">Acertos</div><div class="metric-value" style="color:#00ff66; text-shadow: 0 0 10px rgba(0,255,102,0.3);">{total_acertos}</div></div>', unsafe_allow_html=True)
        with col3:
            st.markdown(f'<div class="metric-box"><div class="metric-title">Erros</div><div class="metric-value">{total_erros}</div></div>', unsafe_allow_html=True)
        with col4:
            st.markdown(f'<div class="metric-box-green"><div class="metric-title">Aproveitamento</div><div class="metric-value-green">{taxa_acerto:.1f}%</div></div>', unsafe_allow_html=True)
        
        st.write("---")
        
        # 🎯 NOVA MÉTRICA: Barra de Progresso de Meta Semanal
        st.subheader("🎯 Meta de Consistência Semanal")
        meta_semanal = 100
        progresso = min(total_questoes / meta_semanal, 1.0)
        st.progress(progresso)
        st.markdown(f"Você realizou **{total_questoes}** de uma meta de **{meta_semanal}** questões esta semana.")
        
        st.write("---")
        
        # 📈 Gráfico de Linha de Frequência Diária
        st.subheader("📈 Frequência de Estudos (Questões por Dia)")
        df_frequencia = df_filtrado.copy()
        df_frequencia['Data'] = df_frequencia['data_criacao'].dt.date
        df_linha = df_frequencia.groupby('Data').size()
        
        if not df_linha.empty:
            st.line_chart(df_linha, color="#00ff66")
        else:
            st.info("Sem dados de histórico para exibir neste período.")
            
        st.write("---")
        
        # 📊 Gráfico de barras simples e intuitivo (Verde Neon e Vermelho Alaranjado)
        st.subheader("📚 Comparativo de Rendimento por Disciplina")
        df_agrupado = df_filtrado.groupby(['materia', 'acertou']).size().unstack(fill_value=0)
        
        if True not in df_agrupado.columns: df_agrupado[True] = 0
        if False not in df_agrupado.columns: df_agrupado[False] = 0
        df_agrupado = df_agrupado.rename(columns={True: 'Acertos', False: 'Erros'})
        
        st.bar_chart(df_agrupado, stack=True, color=["#00ff66", "#ff4500"])

        st.write("---")

        # 📋 Tabela com o Detalhamento
        st.subheader("📝 Detalhamento por Disciplina")
        
        tabela_materias = df_filtrado.groupby('materia').agg(
            Total=('acertou', 'count'),
            Acertos=('acertou', lambda x: (x == True).sum()),
            Erros=('acertou', lambda x: (x == False).sum())
        ).reset_index()
        
        tabela_materias['Aproveitamento'] = (tabela_materias['Acertos'] / tabela_materias['Total'] * 100).round(1).astype(str) + '%'
        
        tabela_materias = tabela_materias.rename(columns={
            'materia': 'Matéria',
            'Total': 'Total Respondidas'
        })
        
        st.dataframe(tabela_materias, hide_index=True, use_container_width=True)

    else:
        st.info("O banco de dados está conectado com sucesso, mas nenhuma questão foi registrada ainda.")

except Exception as e:
    st.error(f"Erro de conexão com o banco de dados. Detalhes: {e}")
