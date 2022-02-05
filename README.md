# wordle-to-yaml-action

Save Wordle scores to a YAML file. Pair it with the [iOS Shortcut](shortcut/README.md) to automatically format and open the GitHub issue.

## Example output

```yaml
- number: 210
  score: 3
  board:
    - "🟩⬛⬛⬛⬛"
    - "⬛⬛🟨🟩🟨"
    - "🟩🟩🟩🟩🟩"
  boardWords:
    - "yes no no no no"
    - "no no almost yes almost"
    - "yes yes yes yes yes"
  won: true
  date: "2022-01-15"
```

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
        uses: katydecorah/wordle-to-yaml-action@v1.0.0
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
