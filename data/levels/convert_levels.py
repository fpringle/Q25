import os.path
import json
import sys


file = sys.argv[1]
puzzles = []
idx = int(sys.argv[2]) if len(sys.argv) > 2 else 1
with open(file) as f:
    for line in f:
        puzzle = json.loads(line)
        puzzle["number"] = idx
        puzzles.append(puzzle)
        idx += 1

with open(os.path.join(os.path.abspath(os.path.dirname(__file__)), "all_levels.json"), "w") as f:
    json.dump(puzzles, f, indent=2)
