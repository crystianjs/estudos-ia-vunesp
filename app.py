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

# Estilização customizada em CSS para deixar o visual moderno
st.markdown("""
    <style>
    .metric-box {
        background-color: #1e293b;
        padding: 15px;
        border-radius: 10px;
        text-align: center;
        border: 1px solid #334155;
        margin-bottom: 10px;
    }
    .metric-title { color: #94a3b8; font-size: 14px; margin-bottom: 5px; }
    .metric-value { color: #f8fafc; font-size: 28px; font-weight: bold; }
    </style>
""", unsafe_allow_html=True)

st.title("📊 Painel de Desempenho Acadêmico")
st.caption("Dados em tempo real integrados diretamente ao banco de dados Supabase (PostgreSQL).")

# Função segura para ler dados do Supabase
def carregar_dados():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )
    # Busca todo o histórico de questões
    query = "SELECT materia, acertou FROM resultados;"
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

try:
    df = carregar_dados()
    
    if not df.empty:
        # 🧮 Cálculos de métricas gerais
        total_questoes = len(df)
        total_acertos = df[df['acertou'] == True].shape[0]
        taxa_acerto = (total_acertos / total_questoes) * 100 if total_questoes > 0 else 0

        # 📱 Exibição dos cartões de métricas (Layout adaptável)
        col1, col2, col3 = st.columns(3)
        with col1:
            st.markdown(f'<div class="metric-box"><div class="metric-title">Total Respondidas</div><div class="metric-value">{total_questoes}</div></div>', unsafe_allow_html=True)
        with col2:
            st.markdown(f'<div class="metric-box"><div class="metric-title">Total Acertos</div><div class="metric-value">{total_acertos}</div></div>', unsafe_allow_html=True)
        with col3:
            st.markdown(f'<div class="metric-box"><div class="metric-title">Taxa de Acerto</div><div class="metric-value">{taxa_acerto:.1f}%</div></div>', unsafe_allow_html=True)
        
        st.write("---")
        
        # 📊 Análise por disciplina
        st.subheader("📚 Rendimento por Matéria")
        
        # Agrupa os dados para criar a matriz de acertos/erros por disciplina
        df_agrupado = df.groupby(['materia', 'acertou']).size().unstack(fill_value=0)
        
        # Garante que ambas as colunas existam para não quebrar o gráfico
        if True not in df_agrupado.columns: df_agrupado[True] = 0
        if False not in df_agrupado.columns: df_agrupado[False] = 0
        
        # Renomeia as colunas para exibição na legenda
        df_agrupado = df_agrupado.rename(columns={True: 'Acertos', False: 'Erros'})
        
        # Exibe o gráfico de barras empilhadas interativo
        st.bar_chart(df_agrupado, stacked=True)
        
    else:
        st.info("O banco de dados está conectado, mas nenhuma questão foi registrada ainda.")

except Exception as e:
    st.error(f"Erro de conexão com o banco de dados. Verifique as credenciais. Detalhes: {e}")
