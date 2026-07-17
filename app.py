import streamlit as st
import pandas as pd
import psycopg2
import os
import datetime

# Configuração da página para visualização mobile e desktop
st.set_page_config(
    page_title="EstudosIA - Dashboard de Desempenho", 
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
        border: 1px solid rgba(255, 61, 0, 0.2);
        box-shadow: 0 0 15px rgba(255, 61, 0, 0.1);
        margin-bottom: 15px;
    }
    .metric-title { 
        color: #94a3b8; 
        font-size: 14px; 
        font-weight: 500;
        margin-bottom: 5px; 
    }
    .metric-value { 
        color: #ff3d00; 
        font-size: 32px; 
        font-weight: bold; 
        text-shadow: 0 0 10px rgba(255, 61, 0, 0.4);
    }
    
    /* Card Gigante Personalizado conforme o Anexo */
    .big-metric-box {
        background-color: #111422;
        padding: 40px 20px;
        border-radius: 16px;
        text-align: center;
        border: 1px solid rgba(255, 61, 0, 0.25);
        box-shadow: 0 0 25px rgba(255, 61, 0, 0.15);
        margin: 20px auto;
        max-width: 500px;
    }
    .big-metric-title {
        color: #94a3b8;
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 15px;
        letter-spacing: 0.5px;
    }
    .big-metric-value {
        color: #ff3d00;
        font-size: 72px;
        font-weight: 800;
        text-shadow: 0 0 20px rgba(255, 61, 0, 0.6);
        line-height: 1;
    }
    
    /* Destaque especial em Verde Neon para a Taxa de Aproveitamento */
    .metric-box-green {
        background-color: #111422;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        border: 1px solid rgba(0, 255, 0, 0.2);
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.1);
        margin-bottom: 15px;
    }
    .metric-value-green { 
        color: #00ff00; 
        font-size: 32px; 
        font-weight: bold; 
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
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
        border-right: 1px solid rgba(255, 61, 0, 0.15);
    }

    /* Estilo da barra de progresso customizada */
    .custom-progress-bg {
        background-color: #221414;
        border-radius: 8px;
        width: 100%;
        height: 12px;
        margin-bottom: 10px;
        overflow: hidden;
        border: 1px solid rgba(255, 61, 0, 0.1);
    }
    .custom-progress-bar {
        background-color: #ff3d00;
        height: 100%;
        border-radius: 8px;
        box-shadow: 0 0 8px rgba(255, 61, 0, 0.5);
        transition: width 0.5s ease-in-out;
    }
    </style>
""", unsafe_allow_html=True)

# Título customizado com HTML para aplicar o contraste do logotipo
st.markdown('<h1 style="font-size: 40px; font-weight: 800; margin-bottom: 0px;">📊 Estudos<span style="color:#ff3d00;">IA</span> - Dashboard</h1>', unsafe_allow_html=True)
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
        
        # Mapeamento oficial de meses ordenados para o português
        meses_map = {
            1: "janeiro", 2: "fevereiro", 3: "março", 4: "abril",
            5: "maio", 6: "junho", 7: "julho", 8: "agosto",
            9: "setembro", 10: "outubro", 11: "novembro", 12: "dezembro"
        }
        df['Mes_Num'] = df['data_criacao'].dt.month
        df['Mês'] = df['Mes_Num'].map(meses_map)

        # 🎯 BARRA LATERAL (FILTROS)
        st.sidebar.markdown("<h2 style='color:#ff3d00; font-size:22px; text-shadow: 0 0 8px rgba(255,61,0,0.3);'>🎯 Filtros</h2>", unsafe_allow_html=True)
        
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

        # 📱 Exibição dos cartões de métricas
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.markdown(f'<div class="metric-box"><div class="metric-title">Respondidas</div><div class="metric-value">{total_questoes}</div></div>', unsafe_allow_html=True)
        with col2:
            st.markdown(f'<div class="metric-box"><div class="metric-title">Acertos</div><div class="metric-value" style="color:#00ff00; text-shadow: 0 0 10px rgba(0,255,0,0.4);">{total_acertos}</div></div>', unsafe_allow_html=True)
        with col3:
            st.markdown(f'<div class="metric-box"><div class="metric-title">Erros</div><div class="metric-value">{total_erros}</div></div>', unsafe_allow_html=True)
        with col4:
            st.markdown(f'<div class="metric-box-green"><div class="metric-title">Aproveitamento</div><div class="metric-value-green">{taxa_acerto:.1f}%</div></div>', unsafe_allow_html=True)
        
        st.write("---")
        
        # 🎯 META SEMANAL
        st.subheader("🎯 Meta de Consistência Semanal")
        meta_semanal = 100
        porcentagem_progresso = min((total_questoes / meta_semanal) * 100, 100.0)
        
        st.markdown(f"""
            <div class="custom-progress-bg">
                <div class="custom-progress-bar" style="width: {porcentagem_progresso}%;"></div>
            </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f"Você realizou **{total_questoes}** de uma meta de **{meta_semanal}** questões esta semana.")
        
        st.write("---")
        
        # 📦 SUBSTITUÍDO: Card Neon Gigante Isolado (Ignora filtros e calcula o mês vigente automaticamente)
        mes_atual_num = datetime.datetime.now().month
        questoes_do_mes_atual = df[df['Mes_Num'] == mes_atual_num].shape[0]
        
        st.markdown(f"""
            <div class="big-metric-box">
                <div class="big-metric-title">Número de questão no mês</div>
                <div class="big-metric-value">{questoes_do_mes_atual}</div>
            </div>
        """, unsafe_allow_html=True)
            
        st.write("---")
        
        # 📊 Gráfico de Rendimento por Disciplina
        st.subheader("📚 Proporção de Rendimento por Disciplina")
        df_agrupado = df_filtrado.groupby(['materia', 'acertou']).size().unstack(fill_value=0)
        
        if True not in df_agrupado.columns: df_agrupado[True] = 0
        if False not in df_agrupado.columns: df_agrupado[False] = 0
        df_agrupado = df_agrupado.rename(columns={True: 'Acertos', False: 'Erros'})
        
        st.bar_chart(df_agrupado, stack=True, color=["#00ff00", "#ff3d00"])

        st.write("---")

        # 📋 Tabela de Detalhamento
        st.subheader("📝 Detalhamento por Disciplina")
        
        tabela_materias = df_filtrado.groupby('materia').agg(
            Total=('acertou', 'count'),
            Acertos=('acertou', lambda x: (x == True).sum()),
            Erros=('acertou', lambda x: (x == False).sum())
        ).reset_index()
        
        tabela_materias = tabela_materias.rename(columns={
            'materia': 'Matéria',
            'Total': 'Total Respondidas'
        })
        
        st.dataframe(tabela_materias, hide_index=True, use_container_width=True)

    else:
        st.info("O banco de dados está conectado com sucesso, mas nenhuma questão foi registrada ainda.")

except Exception as e:
    st.error(f"Erro de conexão com o banco de dados. Detalhes: {e}")
