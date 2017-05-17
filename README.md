# markx

markx is a markdown compiler built on node.js

# <center>**MarkX Syntax**</center>

# Guide

## Line Breaks and Paragraphs

A paragraph with a line break will insert `<br />`. A `\\` will do the same.

An empty line will be considered as a beginning/end of a paragraph.

## Emphasis

### Italic

	*text*

### Boldface

	**text**

### Italic & Boldface

	***text***

### Underline

	_text_

### Strike Through

	__text__

### Underline & Strike Through

	___text___

### Highlight (yellow)

	-text-

### Colored Text (red)

	--text--

### Boxed Text

	---text---

## Header & Title

### Title

	# This is a title #

### Header 1

	# This is an H1

### Header 2

	## This is an H2

### Header 3

	### This is an H3

### Header 4

	#### This is an H4

### Header 5

	##### This is an H5

### Header 6

	###### This is an H6

## Code Block

	```cpp
	#include <iostream>

	int main() {
		std::cout << "Hello World" << endl;
		return 0;
	}
	```

## Inline code

Use "`" to describe inline code:

	`inline code`

## Block Quotes

	>>>
	Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
	tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
	quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
	consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
	cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
	proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	<<<

Block Quotes can be nested

## Boxed Paragraph With Colored Background

	^^^
	Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
	tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
	quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
	consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
	cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
	proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	^^^

### Lists

#### Ordered Lists

	1	Item 1
	2	Item 2
	3	Item 3

	a	Item 1
	b	Item 2
	c	Item 3

	A	Item 1
	B	Item 2
	C	Item 3

	I	Item 1
	II	Item 2
	III	Item 3

	i	Item 1
	ii	Item 2
	iii	Item 3

#### Unordered Lists

	*	Item 1
	*	Item 2
	*	Item 3

	+	Item 1
	+	Item 2
	+	Item 3

	-	Item 1
	-	Item 2
	-	Item 3

	>	Item 1
	>	Item 2
	>	Item 3

### Horizontal Lines

	---
	===
	***
	~~~

## Other Elements

### Links

	[text here](address here)

	<address here> % short hand link

### Media (image, gif, video)

	![optional caption](link)

### Subscript

	text_{subscript}

### Superscript

	text^{superscript}

### Footnote

	Here is some text[^1].

	[^1] Refer to some links to read more.


## Paragraph Alignment

### Align Left

	^^^ <
	text
	^^^

### Align Middle

	^^^ =
	text
	^^^

### Align Right

	^^^ >
	text
	^^^

### Fit width

	^^^ ==
	text
	^^^

#### Columns

	``` = = % 2 columns
	text text and more text
	```

	``` = = = % 3 columns
	text text and more text
	```

	``` == = % 2 columns with width 2/3 and 1/3
	text text and more text
	```

### Table

	| th | th | th |
	|====|====|====|
	| hd | hd | hd |
	|----|----|----|
	| hd | hd | hd |

	|====|====|====|
	| td | td | td |

	| td | td | td |
	| td | td | td |

	| td | td | td |
	| text \\ text | td | td|

	table title
	| th | th | th |
	|====|====|====|
	| hd | hd | hd |

	| th      | th |
	|----|----|----|
	| th | th | th |
	|====|====|====|
	| td      | td |
	|         |----|
	|         | td |

## Math Equations
```
$1$, $\int_{- \infty}^{\infty} \frac{1}{x^2} \, dx$ % in line math equation
```

```
$$\int_{- \infty}^{\infty} \frac{1}{x^2} \, dx$$ % center aligned math equation
```

## Misc

### Comment

	Text % This is a comment

	%% Comment that is
	on multiple lines%%

### Escapes

	\% will show a % sign
	\\\ will show a \ sign
	\` will show a ` sign

# Language Specs

## Tokens

*	`*` STAR
*	`_` UNDERLINE
*	`-` DASH
*	`#` POUND
*	` BACKTICK
*	`>` ANGLEOPEN
*	`<` ANGLECLOSE
*	`^` SUPERSCRIPT
*	`+` PLUS
*	`=` EQUAL
*	`~` TILDE
*	`[` SQUAREOPEN
*	`]` SQUARECLOSE
*	`(` ROUNDOPEN
*	`)` ROUNDCLOSE
*	`!` EXCLAMATION
*	`{` BRACKETOPEN
*	`}` BRACKETCLOSE
*	`%` PERCENT
*	`|` BAR
*	`\` BACKSLASH
*	`$` DOLLAR
*	NEWLINE
*	TEXT

## Derivation Rule

||||
|---|---|---|
| markx | -> | element elements |
| elements | -> | element elements |
| elements | -> | |