# Youtube to MP3 converter

Paste the code on local computer and run python file.

## Step

1. Install python
2. Install packages `"$ pip install pytubefix"`
3. Copy the below code and run!

<br/>

```python
from pytubefix import Playlist, YouTube
import os
import re


# 진행 상태 출력 함수
def on_progress(stream, chunk, bytes_remaining):
    total_size = stream.filesize
    bytes_downloaded = total_size - bytes_remaining
    percentage = (bytes_downloaded / total_size) * 100
    print(f"\rDownloading... {percentage:.2f}%", end="")

def get_best_audio(yt):
    max_audio = 0
    best_audio_itag = None

    # 오디오 스트림에서 가장 높은 비트레이트 찾기
    for audio_stream in yt.streams.filter(only_audio=True):
        try:
            abr = int(audio_stream.abr.replace("kbps", ""))
            if abr > max_audio:
                max_audio = abr
                best_audio_itag = audio_stream.itag
        except AttributeError:
            continue  # 일부 스트림에 abr 속성이 없을 수도 있음

    return best_audio_itag

def clean_filename(title):
    return re.sub(r'[\\/*?:"<>|]', '', title)


# 유튜브 URL 설정
playlist_url = "link/to/your playlist!"

# YouTube 객체 생성 (진행률 표시 추가)
pl = Playlist(playlist_url)
print(f"\n🎵 플레이리스트 제목: {pl.title}")
print(f"📁 총 {len(pl.video_urls)}개의 오디오 다운로드 시작!\n")

download_path = "downloads"
os.makedirs(download_path, exist_ok=True)

for index, url in enumerate(pl.video_urls, start=1):
    try:
        yt = YouTube(url, on_progress_callback=on_progress)
        title = clean_filename(yt.title)

        print(f"\n▶ ({index}/{len(pl.video_urls)}) {title} 다운로드 중...")

        # 최상 품질 오디오 itag 찾기
        audio_itag = get_best_audio(yt)

        if audio_itag:
            audio_file = yt.streams.get_by_itag(audio_itag).download(output_path=download_path, filename=f"{title}.m4a")
            print(f"\n✅ {title} 다운로드 완료!")
        else:
            print(f"\n❌ {title} 다운로드 실패 (오디오 스트림 없음)")

    except Exception as e:
        print(f"\n⚠️ 오류 발생: {e} (영상 건너뜀)")

print("\n🎉 모든 다운로드 완료!")

```

In this case, the saved audio file will be `.m4a`. If you want to change it to `.mp3`, use the code below.

```python
import subprocess
import os

def convert_m4a_to_mp3(m4a_file_path, mp3_file_path):
    print(f"🎧 변환 시작: {os.path.basename(m4a_file_path)}")

    command = f'ffmpeg -hide_banner -y -loglevel error -i "{m4a_file_path}" -vn -ar 44100 -ac 2 -ab 192k -f mp3 "{mp3_file_path}"'
    try:
        subprocess.check_call(command, shell=True)
        print(f"✅ 변환 완료: {mp3_file_path}")
    except subprocess.CalledProcessError:
        print(f"❌ 변환 실패: {m4a_file_path}")
        raise

def convert_all_m4a(input_directory, output_directory):
    os.makedirs(output_directory, exist_ok=True)

    for filename in os.listdir(input_directory):
        if filename.endswith(".m4a"):
            m4a_file_path = os.path.join(input_directory, filename)
            mp3_file_name = filename.replace('.m4a', '.mp3')
            mp3_file_path = os.path.join(output_directory, mp3_file_name)

            if os.path.exists(mp3_file_path):
                print(f"⏭ 이미 존재: {mp3_file_name}")
                continue  # 건너뜀

            try:
                convert_m4a_to_mp3(m4a_file_path, mp3_file_path)
            except Exception as e:
                print(f"⚠️ 오류 발생 - 건너뜀: {e}")

# 실행
input_directory = "downloads/"
output_directory = "downloads2/"
convert_all_m4a(input_directory, output_directory)
```

DONE!
