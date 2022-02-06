import os.path
import json
import re
import sys


def get_files(directory):
    files = [file for file in os.listdir(directory) if re.match(r"level\d+\.json$", file)]
    files.sort(key=lambda f: int(re.search(r"\d+", f)[0]))
    return [os.path.join(directory, file) for file in files]

def get_data(files):
    levels = []
    for file in files:
        with open(file) as f:
            levels.append(json.load(f))

    return levels

def main():
    if len(sys.argv) > 1:
        directory = sys.argv[1]
    else:
        directory = os.path.dirname(__file__)

    directory = os.path.abspath(directory)
    files = get_files(directory)
    levels = get_data(files)
    with open(os.path.join(directory, "all_levels.json"), "w") as f:
        json.dump(levels, f, indent=2)


if __name__ == "__main__":
    main()
