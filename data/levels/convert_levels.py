import os.path
import json
import sys


file = sys.argv[1]
puzzles = []
idx = int(sys.argv[2]) if len(sys.argv) > 2 else 1
with open(file) as f:
    for line in f:
        puzzle = json.loads(line)
        #puzzle["number"] = idx
        puzzles.append(puzzle)
        #idx += 1

puzzles.sort(key=lambda puzzle: puzzle["maxScore"])
for number, puzzle in enumerate(puzzles, idx):
    puzzle["number"] = number

cleaned = {}
for puzzle in puzzles:
    print(puzzle)
    cleaned[puzzle["number"]] = {
        "number": puzzle["number"],
        "letters": puzzle["letters"],
        "maxScore": puzzle["maxScore"],
        "bestUserScore": 0,
        "bestUserSolution": [],
    }

#with open(os.path.join(os.path.abspath(os.path.dirname(__file__)), "all_levels.json"), "w") as f:
#    json.dump(cleaned, f, indent=2)
