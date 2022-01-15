# wordle-to-yaml-action

Save Wordle score to yaml from a GitHub issue.

## Set up

Create `.github/workflows/wordle.yml` file using the following template:

<!-- START GENERATED SETUP -->

```yml
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
        uses: katydecorah/wordle-to-yaml-action@0.2.0
      - name: Commit files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m "${{ env.WordleSummary }}"
          git push "https://${GITHUB_ACTOR}:${{secrets.GITHUB_TOKEN}}@github.com/${GITHUB_REPOSITORY}.git" HEAD:${GITHUB_REF}
      - name: Close issue
        uses: peter-evans/close-issue@v1
        with:
          issue-number: "${{ env.IssueNumber }}"
          comment: "Added ${{ env.WordleSummary }}"
```

<!-- END GENERATED SETUP -->

## Options

<!-- START GENERATED OPTIONS -->

- `wordleFileName`: The file where you want to save your Wordle scores. Default: `_data/wordle.yml`.

<!-- END GENERATED OPTIONS -->

## Creating an issue

The title of the issue should be include the game number and your score, example:

```
Wordle 210 3/6
```

The body of the issue should only contain the emoji board, example:

```
🟩⬛⬛⬛⬛
⬛⬛🟨🟩🟨
🟩🟩🟩🟩🟩
```
