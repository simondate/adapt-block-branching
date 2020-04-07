## adapt-block-branching

An Adapt framework extension to add block based branching to a page.


## Attributes

**_scenario** (object) The setting is required for every single block on the page with Branching
**_isEnabled** (boolean) Turns the current block into a branching block. This will hide any blocks that appear later in the page.
**_scenarioId** (string) Used to assign an ID for the current block. This is used instead of the normal Block ID so that the extension still functions when you import/export the course from the Adapt Authoring Tool.
**\_userAnswer** (array - strings): This array links to the scenario ID of the following blocks on the page to the answers of the items array in any question component inside this block.
