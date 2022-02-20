# wordle-to-yaml-action

Save Wordle scores to a YAML file. Pair it with the [iOS Shortcut](shortcut/README.md) to automatically format and open the GitHub issue.

## Example output

```yaml
totalPlayed: 6
totalWon: 6
totalWonPercent: "100"
streakCurrent: 1
streakMax: 1
distribution:
  1: 0
  2: 0
  3: 1
  4: 2
  5: 3
  6: 0
  X: 0
games:
  - number: 244
    score: 5
    won: true
    board:
      - "⬛⬛⬛⬛🟩"
      - "⬛⬛🟨⬛🟩"
      - "⬛🟨⬛🟨⬛"
      - "🟨⬛⬛🟨🟩"
      - "🟩🟩🟩🟩🟩"
    boardWords:
      - "no no no no yes"
      - "no no almost no yes"
      - "no almost no almost no"
      - "almost no no almost yes"
      - "yes yes yes yes yes"
    date: "2022-02-18"
```

See [\_data/wordle.yml](https://github.com/katydecorah/wordle-to-yaml-action/blob/main/_data/wordle.yml) for an extended output.

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Wordle

on:
  issues:
    types: opened

jobs:
  update_library:
    runs-on: macOS-latest
    name: Wordle
    # only continue if issue has "wordle" label
    if: contains( github.event.issue.labels.*.name, 'wordle')
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Wordle
        uses: katydecorah/wordle-to-yaml-action@v2.1.0
      - name: Commit files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git commit -am "${{ env.WordleSummary }}"
          git push
      - name: Close issue
        uses: peter-evans/close-issue@v1
        with:
          issue-number: "${{ env.IssueNumber }}"
          comment: "Added ${{ env.WordleSummary }}"
```

## Action options

- `wordleFileName`: The file where you want to save your Wordle scores. Default: `_data/wordle.yml`.

<!-- END GENERATED DOCUMENTATION -->

## Create an issue

The title of the issue should include the game number and your score, example:

```
Wordle 210 3/6
```

The body of the issue should contain the emoji board, examples:

```
🟩⬛⬛⬛⬛
⬛⬛🟨🟩🟨
🟩🟩🟩🟩🟩
```

or

```
Wordle 210 3/6
🟩⬛⬛⬛⬛
⬛⬛🟨🟩🟨
🟩🟩🟩🟩🟩
```
