#!/bin/bash

# ===================================================================
#      SCRIPT DE LIVE 24/7 PARA YOUTUBE - VERSÃO ROBUSTA
# ===================================================================
# Este script foi projetado para ser simples, estável e reiniciar
# automaticamente em caso de falha.
# -------------------------------------------------------------------

# --- CONFIGURAÇÃO ---
# 1. Coloque sua chave de transmissão do YouTube aqui.
#    Encontre em: YouTube Studio > Criar > Transmitir ao vivo.
KEY="COLOQUE_SUA_CHAVE_DE_STREAM_AQUI"

# 2. Verifique se os nomes dos seus arquivos de mídia estão corretos.
#    Faça o upload do seu vídeo e áudio para a área de arquivos do Replit.
VIDEO_SOURCE="video.mp4"
AUDIO_SOURCE="audio.mp3"

# --- CONFIGURAÇÕES DE STREAM (Avançado) ---
YOUTUBE_URL="rtmp://a.rtmp.youtube.com/live2"
PRESET="veryfast"   # 'veryfast' usa menos CPU, ideal para o Replit.
BITRATE="2500k"     # Taxa de bits do vídeo. 2500k é bom para 720p.
FPS="30"            # Frames por segundo.
# --------------------------------------------------------------------


# Loop infinito para manter a live no ar.
# Se o comando FFmpeg falhar ou terminar, o script espera 5 segundos
# e tenta novamente, garantindo a continuidade da live 24/7.
while true; do
    echo "▶️  Iniciando a transmissão para o YouTube..."
    echo "================================================="
    
    ffmpeg \
        -re -stream_loop -1 -i "$VIDEO_SOURCE" \
        -re -stream_loop -1 -i "$AUDIO_SOURCE" \
        -map 0:v:0 -map 1:a:0 \
        -c:v libx264 \
        -pix_fmt yuv420p \
        -preset "$PRESET" \
        -r "$FPS" \
        -g $(($FPS * 2)) \
        -b:v "$BITRATE" \
        -c:a aac \
        -b:a 128k \
        -ar 44100 \
        -f flv \
        "$YOUTUBE_URL/$KEY"

    echo "⚠️  A transmissão foi interrompida. Reiniciando em 5 segundos..."
    echo "================================================="
    sleep 5
done