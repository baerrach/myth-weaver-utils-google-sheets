# WARNING

The current version is functionally complete - it works for my characters :)

YMMV.

The documentation is also non-existent. This will get rectified shortly.

# Overview

## What can Dossier Dominator do for me?

This started out life as a race between two parties in the same game competing to see who could start working together the quickest. TravelLog created the first Dossier summary of his party's skills; Characters, Classes, Skills (over a defined threshold). This was a great way to see what characters were good at, but didn't show where the gaps were, and it didn't scale as players made changes to their character sheets (or even later when they leveled). So instead of spending the few hours manually updating the dossier with the changes, I've spend a few weeks writing code to automate the process - lucky you!

The current features list of Dossier Dominator includes:

* Create a table of Skills by Character
* Create a summary of Skills per Character
* Create an advanced statblock for a Character
* Create a dice roll block for each Character (currently only Initiative supported)


As a player, I was creating overly elaborate statblocks. The ones that come with the myth-weavers sheets via `Generate Statblock` have a great overview, but I find for my preferred posting style (and especially across multiple games) I like to be reminded of what my character can do easily in the preview post option. I also find it great to be able cut and paste key information from the statblock for inclusion in OOC/action spoiler tags. And depending on the GM having everything 'in the post' instead of on another page is a handy reference.



# Installing

See the wiki page on [Installing](https://github.com/baerrach/myth-weaver-utils-google-sheets/wiki/Installing)

# How to use

The first sheet of your document is your summary of characters and their skills.

Columns C onwards is where you store your character details. You only need to fill in the sheet id it in the first row. The `Add stats from Myth-Weaver sheet id (active cell)` script will then populate the rest of the column, including skill names in column A if they are missing.

Cell B1 is special, it is the minimum skill level required for inclusion in the summary report.
The rest of column B is also special. It contains the maximum values for the current row.
This allows the script to just use this value instead of having to calculate it.
It also allows the conditional formatting to highlight in yellow all cells that are the maximum value.
Both the row maximums and the conditional highlighting may be removed in future versions as they dont offer anytning the summary is not showing.

