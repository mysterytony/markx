## Tokens

| ID | Literal | Notes |
|---|---|---|
| POUND | # | |
| ESC | ` | |
| ASTERISK | * | |
| UNDERSCORE | _ | |
| RIGHTANGLE | > | |
| LEFTANGLE | < | |
| CARET | ^ | |
| NUM | 0 ~ 9 | combination of numbers, from 0 to 9 |
| NUMONE | 0 | number 0 |
| WORD | a ~ z | combination of alphabets, no spaces |
| UPPERROMAN | I | |
| LOWERROMAN | i | |
| PLUS | + | |
| MINUS | - | |
| EQUAL | = | |
| SQUIGGLY | ~ | |
| LEFTSQUAREBRACKET | [ | |
| RIGHTSQUAREBRACKET | ] | |
| LEFTPAREN | ( | |
| RIGHTPAREN | ) | |
| EXCLAMATION | ! | |
| LEFTBRACKET | { | |
| RIGHTBRACKET | } | |
| PERCENT | % | |
| BAR | \| | |
| SLASH | \ | |
| DOLLAR | $ | |
| SPACES | continues of spaces or tabs ||
| SINGLESPACE | one space or one tab ||
| ENDLINE | end of line symbol "\n" | |
| NEWLINE | beginning of line ||
| COLON | : ||
| SEMICOLON | ; ||
| UPPERA | A ||
| LOWERA | a ||

## Context-Free Grammar

* markx -> NEWFILE statements ENDFILE

* statements -> statement statements
* statements -> {ENDFILE}

* statement -> NEWLINE POUND SPACE inlines SPACE POUND ENDLINE
* statement -> NEWLINE POUND SPACE inlines ENDLINE
* statement -> NEWLINE POUND POUND SPACE inlines ENDLINE
* statement -> NEWLINE POUND POUND POUND SPACE inlines ENDLINE
* statement -> NEWLINE POUND POUND POUND POUND SPACE inlines ENDLINE
* statement -> NEWLINE POUND POUND POUND POUND POUND SPACE inlines ENDLINE
* statement -> NEWLINE POUND POUND POUND POUND POUND POUND SPACE inlines ENDLINE
* statement -> NEWLINE ESC ESC ESC SPACE WORD ENDLINE codelines NEWLINE ESC ESC ESC ENDLINE
* statement -> NEWLINE inlines ENDLINE
* statement -> NEWLINE RIGHTANGLE RIGHTANGLE RIGHTANGLE lines LEFTANGLE LEFTANGLE LEFTANGLE ENDLINE
* statement -> NEWLINE CARET CARET CARET ENDLINE lines NEWLINE CARET CARET CARET ENDLINE
* statement -> list

* list -> NEWLINE LOWERROMAN SINGLESPACE inlines ENDLINE sublist
* list -> NEWLINE UPPERROMAN SINGLESPACE inlines ENDLINE sublist
* list -> NEWLINE RIGHTANGLE SINGLESPACE inlines ENDLINE sublist
* list -> NEWLINE MINUS SINGLESPACE inlines ENDLINE sublist
* list -> NEWLINE PLUS SINGLESPACE inlines ENDLINE sublist
* list -> NEWLINE ASTERISK SINGLESPACE inlines ENDLINE sublist
* list -> NEWLINE LOWERA SINGLESPACE inlines ENDLINE sublist
* list -> NEWLINE UPPERA SINGLESPACE inlines ENDLINE sublist
* list -> NEWLINE NUMONE SINGLESPACE inlines ENDLINE sublist

* sublist -> NEWLINE LOWERROMAN SINGLESPACE inlines ENDLINE sublist
* sublist -> NEWLINE UPPERROMAN SINGLESPACE inlines ENDLINE sublist
* sublist -> NEWLINE RIGHTANGLE SINGLESPACE inlines ENDLINE sublist
* sublist -> NEWLINE MINUS SINGLESPACE inlines ENDLINE sublist
* sublist -> NEWLINE PLUS SINGLESPACE inlines ENDLINE sublist
* sublist -> NEWLINE ASTERISK SINGLESPACE inlines ENDLINE sublist
* sublist -> NEWLINE WORD SINGLESPACE inlines ENDLINE sublist
* sublist -> NEWLINE NUM SINGLESPACE inlines ENDLINE sublist
* sublist -> {NEWLINE}

* statement -> NEWLINE MINUS MINUS MINUS ENDLINE
* statement -> NEWLINE EQUAL EQUAL EQUAL ENDLINE
* statement -> NEWLINE SQUIGGLY SQUIGGLY SQUIGGLY ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE LEFTANGLE ENDLINE statements NEWLINE CARET CARET CARET ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE RIGHTANGLE ENDLINE statements NEWLINE CARET CARET CARET ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL ENDLINE statements NEWLINE CARET CARET CARET ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL EQUAL ENDLINE statements NEWLINE CARET CARET CARET ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL SINGLESPACE EQUAL ENDLINE statements NEWLINE CARET CARET CARET ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL SINGLESPACE EQUAL SINGLESPACE EQUAL ENDLINE statements NEWLINE CARET CARET CARET ENDLINE
* statement -> table

* table -> tableheads tablerows

* tableheads -> tablehead subtableheads

* subtableheads -> tablehead subtableheads
* subtableheads -> {NEWLINE}

* tablehead -> NEWLINE headcols BAR ENDLINE

* headcols -> headcol  subheadcols

* subheadcols -> headcol  subheadcols
* subheadcols -> {BAR}

* headcol -> BAR COLON COLON inlines COLON COLON
* headcol -> BAR

* tablerows -> tablerow subtablerows

* subtablerows -> tablerow subtablerows
* subtablerows -> {NEWLINE}

* tablerow -> NEWLINE rowcols BAR ENDLINE

* rowcols -> rowcol subrowcols

* subrowcols -> rowcol subrowcols
* subrowcols -> {BAR}

* rowcol -> BAR inlines
* rowcol -> BAR
* rowcol -> BAR SEMICOLON SEMICOLON

* lines -> line lines
* lines -> {LEFTANGLE NEWLINE}

* line -> NEWLINE inlines ENDLINE

* inlines -> inline subinlines

* subinlines -> inline subinlines
* subinlines -> {ENDLINE COLON BAR}

* inline -> LEFTSQUAREBRACKET inlines RIGHTSQUAREBRACKET LEFTPAREN url RIGHTPAREN
* inline -> LEFTANGLE url RIGHTANGLE
* inline -> EXCLAMATION LEFTSQUAREBRACKET inlines RIGHTSQUAREBRACKET LEFTPAREN url RIGHTPAREN
* inline -> UNDERSCORE LEFTBRACKET inline RIGHTBRACKET
* inline -> CARET LEFTBRACKET inline RIGHTBRACKET
* inline -> LEFTSQUAREBRACKET CARET NUM RIGHTSQUAREBRACKET
* inline -> DOLLAR math DOLLAR
* inline -> DOLLAR DOLLAR math DOLLAR DOLLAR
* inline -> PERCENT string
* inline -> words
* inline -> ESC inlines ESC
* inline -> ASTERISK inlines ASTERISK
* inline -> ASTERISK ASTERISK inlines ASTERISK ASTERISK
* inline -> ASTERISK ASTERISK ASTERISK inlines ASTERISK ASTERISK ASTERISK
* inline -> UNDERSCORE inlines UNDERSCORE
* inline -> UNDERSCORE UNDERSCORE inlines UNDERSCORE UNDERSCORE
* inline -> UNDERSCORE UNDERSCORE UNDERSCORE inlines UNDERSCORE UNDERSCORE UNDERSCORE
* inline -> MINUS inlines MINUS
* inline -> MINUS MINUS inlines MINUS MINUS
* inline -> MINUS MINUS MINUS inlines MINUS MINUS MINUS

* codelines -> codeline codelines
* codelines -> {NEWLINE}
* codeline -> NEWLINE string ENDLINE

* string -> words
* string -> PERCENT
* string -> SLASH

* math -> WORD math
* math -> POUND math
* math -> ESC math
* math -> ASTERISK math
* math -> UNDERSCORE math
* math -> RIGHTANGLE math
* math -> LEFTANGLE math
* math -> CARET math
* math -> NUMONE math
* math -> NUM math
* math -> UPPERA math
* math -> LOWERA math
* math -> UPPERROMAN math
* math -> LOWERROMAN math
* math -> PLUS math
* math -> MINUS math
* math -> EQUAL math
* math -> SQUIGGLY math
* math -> LEFTSQUAREBRACKET math
* math -> RIGHTSQUAREBRACKET math
* math -> LEFTPAREN math
* math -> RIGHTPAREN math
* math -> EXCLAMATION math
* math -> LEFTBRACKET math
* math -> RIGHTBRACKET math
* math -> BAR math
* math -> SPACES math
* math -> SINGLESPACE math
* math -> PERCENT math
* math -> SLASH math
* math -> {DOLLAR}

* url -> WORD url
* url -> UNDERSCORE url
* url -> NUMONE url
* url -> NUM url
* url -> UPPERA url
* url -> LOWERA url
* url -> UPPERROMAN url
* url -> LOWERROMAN url
* url -> PLUS url
* url -> MINUS url
* url -> EQUAL url
* url -> SQUIGGLY url
* url -> LEFTSQUAREBRACKET url
* url -> RIGHTSQUAREBRACKET url
* url -> LEFTPAREN url
* url -> RIGHTPAREN url
* url -> EXCLAMATION url
* url -> SLASH url
* url -> POUND url
* url -> {RIGHTPAREN, RIGHTANGLE}

* words -> WORD subwords
* words -> NUMONE subwords
* words -> NUM subwords
* words -> UPPERA subwords
* words -> LOWERA subwords
* words -> UPPERROMAN subwords
* words -> LOWERROMAN subwords
* words -> SPACES subwords
* words -> SINGLESPACE subwords

* subwords -> WORD subwords
* subwords -> NUMONE subwords
* subwords -> NUM subwords
* subwords -> UPPERA subwords
* subwords -> LOWERA subwords
* subwords -> UPPERROMAN subwords
* subwords -> LOWERROMAN subwords
* subwords -> SPACES subwords
* subwords -> SINGLESPACE subwords
* subwords -> {ENDLINE RIGHTBRACKET COLON BAR}

## Context-Sensitive Grammar

## Additional Rules

## Parse Table

## Order of Scan

| scan for | parse |
|---|---|
| `\`...\``||
| `<...>` | |
| `![...](...)` ||