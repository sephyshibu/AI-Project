import sys
import whisper

def main():
    model = whisper.load_model("base")
    audio_path = sys.argv[1]
    result = model.transcribe(audio_path)
    print(result["text"])

if __name__ == "__main__":
    main()
