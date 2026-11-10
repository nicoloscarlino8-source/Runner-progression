#!/usr/bin/env python3
"""Prepara il modello Whisper "incorporato" per RP Studio.

Scarica la libreria transformers.js (da npm), il motore ONNX Runtime WASM e il
modello Whisper con tempi parola-per-parola da Hugging Face, poi divide i file
grandi in parti da 14 MB dentro `video-editor/vendor/`.

Serve quando la webapp gira in un posto che non può scaricare nulla da
internet (es. pubblicata come artifact su claude.ai). In locale o su GitHub
Pages non è necessario: l'app scarica il modello da sola.

Uso:  python3 video-editor/tools/bundle_model.py [--model base|tiny]
"""
import argparse
import json
import pathlib
import shutil
import subprocess
import tarfile
import tempfile
import urllib.request

TRANSFORMERS_VERSION = "3.7.6"
MODELS = {
    "base": "onnx-community/whisper-base_timestamped",
    "tiny": "onnx-community/whisper-tiny_timestamped",
}
SMALL_FILES = [
    "config.json",
    "generation_config.json",
    "preprocessor_config.json",
    "tokenizer.json",
    "tokenizer_config.json",
]
ONNX_FILES = ["onnx/encoder_model_quantized.onnx", "onnx/decoder_model_merged_quantized.onnx"]
PART = 14 * 1024 * 1024

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "vendor"


def split(src: pathlib.Path, dest_prefix: str) -> list[str]:
    data = src.read_bytes()
    parts = []
    for i in range(0, len(data), PART):
        name = f"{dest_prefix}.part{i // PART}.wasm"
        (OUT / name).parent.mkdir(parents=True, exist_ok=True)
        (OUT / name).write_bytes(data[i:i + PART])
        parts.append("vendor/" + name)
    return parts


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", choices=MODELS, default="base")
    model = MODELS[ap.parse_args().model]

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        print("· transformers.js", TRANSFORMERS_VERSION)
        subprocess.run(["npm", "pack", f"@huggingface/transformers@{TRANSFORMERS_VERSION}", "-q"],
                       cwd=tmp, check=True, capture_output=True)
        with tarfile.open(next(tmp.glob("*.tgz"))) as t:
            t.extractall(tmp, filter="data")
        dist = tmp / "package" / "dist"
        # il carattere U+FFFD letterale compare solo in stringhe: lo scrivo come escape
        lib = (dist / "transformers.min.js").read_text(encoding="utf-8").replace("\ufffd", "\\ufffd")
        (OUT / "transformers.min.js").write_text(lib, encoding="utf-8")
        wasm_parts = split(dist / "ort-wasm-simd-threaded.jsep.wasm", "ort/ort-wasm")

        files = {}
        mdir = tmp / "model"
        for f in SMALL_FILES + ONNX_FILES:
            url = f"https://huggingface.co/{model}/resolve/main/{f}"
            dest = mdir / f
            dest.parent.mkdir(parents=True, exist_ok=True)
            print("·", f)
            with urllib.request.urlopen(url) as r, open(dest, "wb") as w:
                shutil.copyfileobj(r, w)
            size = dest.stat().st_size
            if f.endswith(".onnx"):
                parts = split(dest, "model/" + f.replace("/", "_"))
            else:
                (OUT / "model").mkdir(exist_ok=True)
                shutil.copy(dest, OUT / "model" / f)
                parts = ["vendor/model/" + f]
            files[f] = {"size": size, "parts": parts}

    manifest = {
        "model": model,
        "lib": "vendor/transformers.min.js",
        "wasm": wasm_parts,
        "files": files,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1))
    total = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    print(f"Pronto: {OUT} ({total / 1e6:.0f} MB)")


if __name__ == "__main__":
    main()
