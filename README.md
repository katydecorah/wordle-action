# wordle-action

Save Wordle scores to a YAML file. Pair it with the [iOS Shortcut](shortcut/README.md) to automatically [create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event). Alternatively, use the **Run workflow** option from the "Actions" tab to paste in a recently played game to trigger the action.

## Example output

```yaml
totalPlayed: 9
totalWon: 9
totalWonPercent: "100"
streakCurrent: 5
streakMax: 5
distribution:
  1: 0
  2: 0
  3: 2
  4: 2
  5: 4
  6: 1
  X: 0
games:
  - number: 210
    score: 3
    won: true
    board:
      - "🟩⬛⬛⬛⬛"
      - "⬛⬛🟨🟩🟨"
      - "🟩🟩🟩🟩🟩"
    boardWords:
      - "yes no no no no"
      - "no no almost yes almost"
      - "yes yes yes yes yes"
    altText: "The player won the game in 3 guesses."
    date: "2022-01-15"
```

See [\_data/wordle.yml](https://github.com/katydecorah/wordle-action/blob/main/_data/wordle.yml) for an extended output.

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Wordle

on:
  workflow_dispatch:
    inputs:
      game:
        description: Wordle game
        required: true
        type: text

jobs:
  update_library:
    runs-on: macOS-latest
    name: Wordle
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Wordle
        uses: katydecorah/wordle-to-yaml-action@v4.0.0
      - name: Commit files
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git commit -am "${{ env.WordleSummary }}"
          git push
```

## Action options

- `wordleFileName`: The file where you want to save your Wordle scores. Default: `_data/wordle.yml`.

<!-- END GENERATED DOCUMENTATION -->

## Send an event

To trigger the action, you will [create a worfklow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with the Wordle game.

The [iOS Shortcut](shortcut/README.md) helps format and send the event.

### Payload

```js
{
  "event_type": "wordle", // Optional. This helps you filter events in the workflow, in case you have more than one.
  "inputs": {
    "game": "", // Required. The Wordle game as formatted by the "Share" option seen after completing a game.
    "date": "", // Optional. The date you finished the book in YYYY-MM-DD format. The default date is today.
  }
}
```
