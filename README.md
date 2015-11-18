# Installing

*WARNING*: The current version is not available as a Google App. This means you need to make a copy of the example sheet, and do some extra steps before you can use it. Unfortunately this means that new code changes will not be available to you. I hope to copy versions of the code here so that you can cut-n-paste into your project and when I work out how to create an App properly then you wont need to do that anyway.

## Copy the example sheet

Open https://docs.google.com/spreadsheets/d/1RcDCJZRbLlAke_T8vA5V0fyaWblSwtjCW7AeJrAZmDA/edit?usp=sharing and then `File > Make a copy`

## Bind the triggers

From the Spreadsheet menu select `Tools > Script editor...`.

Select `Resources > Current project's triggers`.

Click `No triggers set up. Click here to add one now.`

Set `Run` to `onOpen`, `Events` to `From spreadsheet`, and `onOpen`, click `Save`.

You will be prompted to with a dialog `Authorisation required`, click `Continue`, and then `Allow`.

Go back to your Spreadsheet and then reload it (this will close the Script editor) and after it has finished reloading you should have a new menu after `Help` called `Myth Weavers`.

# How to use

The first sheet of your document is your summary of characters and their skills.

Columns C onwards is where you store your character details. You only need to fill in the sheet id it in the first row. The `Add stats from Myth-Weaver sheet id (active cell)` script will then populate the rest of the column, including skill names in column A if they are missing.

Cell B1 is special, it is the minimum skill level required for inclusion in the summary report.
The rest of column B is also special. It contains the maximum values for the current row.
This allows the script to just use this value instead of having to calculate it.
It also allows the conditional formatting to highlight in yellow all cells that are the maximum value.
Both the row maximums and the conditional highlighting may be removed in future versions as they dont offer anytning the summary is not showing.

