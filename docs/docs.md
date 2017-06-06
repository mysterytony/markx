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

## Context-Free Grammar

* statements -> statement statements
* statements ->
* statement -> NEWLINE POUND optspace inlines optspace POUND optspaces ENDLINE
* statement -> NEWLINE pounds optspace inlines ENDLINE
* statement -> NEWLINE ESC ESC ESC optspace WORD ENDLINE codelines NEWLINE ESC ESC ESC optspaces ENDLINE
* statement -> NEWLINE inlines ENDLINE
* statement -> NEWLINE RIGHTANGLE RIGHTANGLE RIGHTANGLE optspaces lines LEFTANGLE LEFTANGLE LEFTANGLE optspaces ENDLINE
* statement -> NEWLINE CARET CARET CARET optspaces ENDLINE lines NEWLINE CARET CARET CARET optspaces ENDLINE
* statement -> numlist
* statement -> alphabetlist
* statement -> upperromanlist
* statement -> lowerromanlist
* statement -> disclist
* statement -> squarelist
* statement -> dashlist
* statement -> anglelist
* statement -> NEWLINE MINUS MINUS MINUS optspaces ENDLINE
* statement -> NEWLINE EQUAL EQUAL EQUAL optspaces ENDLINE
* statement -> NEWLINE SQUIGGLY SQUIGGLY SQUIGGLY optspaces ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE LEFTANGLE optspaces ENDLINE statements NEWLINE CARET CARET CARET optspaces ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE RIGHTANGLE optspaces ENDLINE statements NEWLINE CARET CARET CARET optspaces ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL optspaces ENDLINE statements NEWLINE CARET CARET CARET optspaces ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL EQUAL optspaces ENDLINE statements NEWLINE CARET CARET CARET optspaces ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL SINGLESPACE EQUAL optspaces ENDLINE statements NEWLINE CARET CARET CARET optspaces ENDLINE
* statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL SINGLESPACE EQUAL SINGLESPACE EQUAL optspaces ENDLINE statements NEWLINE CARET CARET CARET optspaces ENDLINE

* lines -> line lines
* lines ->
* line -> NEWLINE inlines ENDLINE

* inlines -> inline inlines
* inlines -> 

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

* anglelist -> NEWLINE LOWERROMAN SINGLESPACE inlines ENDLINE optnewline anglelist
* anglelist ->
* dashlist -> NEWLINE LOWERROMAN SINGLESPACE inlines ENDLINE optnewline dashlist
* dashlist ->
* disclist -> NEWLINE LOWERROMAN SINGLESPACE inlines ENDLINE optnewline disclist
* disclist ->
* lowerromanlist -> NEWLINE LOWERROMAN SINGLESPACE inlines ENDLINE optnewline lowerromanlist
* lowerromanlist->
* upperromanlist -> NEWLINE UPPERROMAN SINGLESPACE inlines ENDLINE optnewline upperromanlist
* upperromanlist ->
* alphabetlist -> NEWLINE WORD SINGLESPACE inlines ENDLINE optnewline alphabetlist
* alphabetlist ->
* numlist -> NEWLINE NUM SINGLESPACE inlines ENDLINE optnewline numlist
* numlist ->

* optnewline -> NEWLINE optspaces ENDLINE

* optspace -> SINGLESPACE
* optspace ->

* optspaces -> SPACES
* optspaces -> SINGLESPACE
* optspaces ->

* codelines -> codeline codelines
* codelines ->
* codeline -> NEWLINE string ENDLINE

* string -> words
* string -> PERCENT
* string -> SLASH

* math -> anything but $
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
* math -> PERCENT
* math -> SLASH
* math ->

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
* url ->

* words -> WORD words
* words -> POUND words
* words -> ESC words
* words -> ASTERISK words
* words -> UNDERSCORE words
* words -> RIGHTANGLE words
* words -> LEFTANGLE words
* words -> CARET words
* words -> NUMONE words
* words -> NUM words
* words -> UPPERA words
* words -> LOWERA words
* words -> UPPERROMAN words
* words -> LOWERROMAN words
* words -> PLUS words
* words -> MINUS words
* words -> EQUAL words
* words -> SQUIGGLY words
* words -> LEFTSQUAREBRACKET words
* words -> RIGHTSQUAREBRACKET words
* words -> LEFTPAREN words
* words -> RIGHTPAREN words
* words -> EXCLAMATION words
* words -> LEFTBRACKET words
* words -> RIGHTBRACKET words
* words -> BAR words
* words -> DOLLAR words
* words -> SPACES words
* words -> SINGLESPACE words
* words ->

Not implemented yet: tables & escapes

## Context-Sensitive Grammar

## Additional Rules

## Parse Table