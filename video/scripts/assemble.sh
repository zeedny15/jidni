#!/bin/bash
# Concatenate chapter chunks, mix narration + music, add soft subtitles (Bahasa Indonesia).
set -e
cd "$(dirname "$0")/.."
ls out/chunks/ch{0..7}.mp4 >/dev/null
: > out/chunks/list.txt
for i in 0 1 2 3 4 5 6 7; do echo "file 'ch$i.mp4'" >> out/chunks/list.txt; done
ffmpeg -loglevel error -y -f concat -safe 0 -i out/chunks/list.txt -c copy out/video_silent.mp4
ffmpeg -loglevel error -y -i out/video_silent.mp4 -i build/narration.wav -i build/music.wav -i out/subtitles.srt \
  -filter_complex "[1:a][2:a]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95,aformat=channel_layouts=stereo[a]" \
  -map 0:v -map "[a]" -map 3:s -c:v copy -c:a aac -b:a 192k -c:s mov_text \
  -metadata:s:a:0 language=ind -metadata:s:s:0 language=ind -metadata title="Fisiologi Vaskular" \
  -shortest -movflags +faststart out/Fisiologi_Vaskular.mp4
ffprobe -v error -show_entries format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate -of compact out/Fisiologi_Vaskular.mp4
