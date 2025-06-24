#!/usr/bin/env python3
import sys
from handwrite import Handwrite

def main(input_path, output_path):
    hw = Handwrite(input_path, output_path, overwrite=True)
    hw.run()
    print("✅ Font generated at:", output_path)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: generate_font.py <input.png> <output.ttf>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
