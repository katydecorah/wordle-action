# wordle-action

Save Wordle scores to a JSON file. Pair it with the [iOS Shortcut](shortcut/README.md) to automatically [create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event). Alternatively, use the **Run workflow** option from the "Actions" tab to paste in a recently played game to trigger the action.

## Example output

```json
{
  "totalPlayed": 9,
  "totalWon": 9,
  "totalWonPercent": "100",
  "streakCurrent": 5,
  "streakMax": 5,
  "distribution": {
    "1": 0,
    "2": 0,
    "3": 2,
    "4": 2,
    "5": 4,
    "6": 1,
    "X": 0
  },
  "games": [
    {
      "number": 210,
      "score": 3,
      "won": true,
      "board": ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
      "boardWords": [
        "yes no no no no",
        "no no almost yes almost",
        "yes yes yes yes yes"
      ],
      "altText": "The player won the game in 3 guesses.",
      "date": "2022-01-15"
    }
  ]
}
```

See [\_data/wordle.json](https://github.com/katydecorah/wordle-action/blob/main/_data/wordle.json) for an extended output.

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Wordle

on:
  workflow_dispatch:
    inputs:
      game:
        description: The Wordle game as formatted by the "Share" option seen after completing a game.
        required: true
        type: string
      date:
        description: The date you played Wordle (YYYY-MM-DD). The default date is today.
        type: string

jobs:
  update_library:
    runs-on: macOS-latest
    name: Wordle
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Wordle
        uses: katydecorah/wordle-action@v6.2.0
      - name: Commit files
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git commit -am "${{ env.WordleSummary }}"
          git push
```

## Action options

- `wordleFileName`: The file where you want to save your Wordle scores. Default: `_data/wordle.json`.

## Trigger the action

To trigger the action, [create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with the following body parameters:

```js
{
  "ref": "main", // Required. The git reference for the workflow, a branch or tag name.
  "inputs": {
    "game": "", // Required. The Wordle game as formatted by the "Share" option seen after completing a game.
    "date": "", // The date you played Wordle (YYYY-MM-DD). The default date is today.
  }
}
```

<!-- END GENERATED DOCUMENTATION -->
