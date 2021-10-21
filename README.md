# Typescript-Action-Create-Includes

- [Typescript-Action-Create-Includes](#typescript-action-create-includes)
  - [Inputs](#inputs)
  - [Examples](#examples)
  - [Example usage](#example-usage)

The github action that creates include code files for your project, the changes still need to be submitted afterwards.

Its creates a list of each typescript file in the folder and for each sub folder that has an `include.ts`.

## Inputs

**folder**:  
The folder path to start at, use `${{github.workspace}}/source`

**excludes**:  
The multi string glob patterns that can exclude files from being listed

**export_sub_include**:  
defaults to true
Whenever or not a include.ts file should be specially exported:
such as:

```ts
export * as Foo from 'Foo/include';
```


## Examples

![example](https://raw.githubusercontent.com/DaanV2/Typescript-Action-Create-Includes/main/assets/example.PNG)

## Example usage

```yml
# This is a basic workflow to help you get started with Actions

name: Creating typescript includes

# Controls when the action will run. 
on:
  # Triggers the workflow on push or pull request events but only for the master branch
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      - uses: actions/checkout@v2.3.4

      # Runs a single command using the runners shell
      - uses: DaanV2/Typescript-Action-Create-Includes@v1.2
        with: 
          folder: ${{github.workspace}}/server/src
          export_sub_include: false
          excludes: "*.test.ts"

      - uses: DaanV2/Typescript-Action-Create-Includes@v1.2
        with: 
          folder: ${{github.workspace}}/client/src
          excludes: |
            "*.test.ts"
            "include.ts"

      - name: Commit changes
        continue-on-error: true
        run: |
          cd ${{github.workspace}}
          git config --global user.email "Bot@DaanV2.com"
          git config --global user.name "Bot"
          git add .
          git commit -m "auto: Generated typescript includes"
          git push
```

