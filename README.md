# myth-weaver-utils-google-sheets

Open https://docs.google.com/spreadsheets/d/1RcDCJZRbLlAke_T8vA5V0fyaWblSwtjCW7AeJrAZmDA/edit?usp=sharing and then File > Make a copy

When the new copy has loaded there should be a new menu named "Myth Weavers".

The first sheet of your document is your summary.
Columns C onwards are where you store your character details. You only need to fill in the sheet it in the first row.
The scripts will then populate the rest of the column, including skill names in column A if they are missing.

Cell B1 is special, it is the minimum skill level required for inclusion in the summary report.
The rest of column B is also special. It contains the maximum values for the current row.
This allows the script to just use this value instead of having to calculate it.
It also allows the conditional formatting to highlight in yellow all cells that are the maximum value.
