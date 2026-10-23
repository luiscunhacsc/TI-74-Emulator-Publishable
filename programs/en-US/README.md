# TI-74 program library (US English)

20 original examples, from your first program to subprograms with parameters. The BASIC files use only ASCII characters supported by the TI-74 keyboard.

## Getting started

1. Open `TI-74.en-US.html` and select BASIC mode. Press CLR if you see `W30 Initialized`.
2. In the **BASIC Library**, search for a topic or command and select an example.
3. **Copy to editor** places the code in the editor. **Restore previous text** undoes this step.
4. **Send to TI-74** enters the lines. **Replace… (NEW)** is selected for examples and erases the previous program; save the state first if you want to keep it.
5. Wait for **Text entered**, press **RUN**, then **ENTER**. Follow the instructions for the example.

Code is entered through the emulated keyboard; speed 4× reduces the wait. `PRINT` followed by `PAUSE` keeps each result visible; press ENTER to continue. Use BREAK to interrupt. Examples are independent: load one at a time. The editor and downloads work without ROMs; running programs requires TI ROMs. Use a period for decimals and enter numbers without thousands separators.

## Learning path

| Program | Topic | Level | Syntax |
| --- | --- | --- | --- |
| [Hello, TI-74](01-hello.bas) | Getting started | Beginner | `REM`, `PRINT`, `PAUSE`, `END`, `:` |
| [Expressions and order of operations](02-arithmetic.bas) | Getting started | Beginner | `LET`, `+`, `*`, `^`, `SQR`, `()` |
| [Add the numbers from 1 to 10](03-sum.bas) | Getting started | Beginner | `FOR`, `TO`, `NEXT`, `variables` |
| [Countdown](04-countdown.bas) | Getting started | Beginner | `FOR`, `STEP`, `NEXT`, `PAUSE` |
| [Temperature converter](05-temperature.bas) | Input and decisions | Beginner | `INPUT`, `variables`, `expressions` |
| [Validate and decide: odd or even](06-decisions.bas) | Input and decisions | Intermediate | `IF`, `THEN`, `ELSE`, `OR`, `INT`, `GOTO` |
| [Slice, join, and search text](07-strings.bas) | Text | Intermediate | `$`, `&`, `SEG$`, `LEN`, `POS` |
| [Text, character codes, and numbers](08-ascii.bas) | Text | Intermediate | `ASC`, `CHR$`, `VAL`, `STR$`, `&` |
| [Read and reread a data table](09-data.bas) | Data and algorithms | Beginner | `DATA`, `READ`, `RESTORE`, `FOR` |
| [Mean and standard deviation](10-statistics.bas) | Data and algorithms | Intermediate | `DIM`, `READ`, `FOR`, `SQR`, `^` |
| [A 2 × 2 matrix](11-matrix.bas) | Data and algorithms | Intermediate | `DIM`, `FOR`, `NEXT`, `DATA`, `indices` |
| [Reuse a subroutine](12-gosub.bas) | Program structure | Intermediate | `GOSUB`, `RETURN`, `GOTO`, `SQR` |
| [A subprogram with parameters](13-subprogram.bas) | Program structure | Advanced | `CALL`, `SUB`, `SUBEND`, `parameters` |
| [Angles and logarithms](14-science.bas) | Science | Intermediate | `DEG`, `RAD`, `SIN`, `PI`, `LOG`, `LN`, `EXP` |
| [Format numbers](15-formatting.bas) | Display and interaction | Intermediate | `IMAGE`, `PRINT USING`, `decimal places` |
| [Roll two dice](16-dice.bas) | Science | Intermediate | `RANDOMIZE`, `RND`, `INT` |
| [Sort five values](17-sorting.bas) | Data and algorithms | Advanced | `DIM`, `FOR`, `IF`, `THEN`, `swapping` |
| [Position text on the LCD](18-display.bas) | Display and interaction | Intermediate | `DISPLAY`, `AT`, `ERASE ALL`, `RPT$`, `;` |
| [Read a key without ENTER](19-keyboard.bas) | Display and interaction | Intermediate | `KEY$`, `ASC`, `PRINT` |
| [Approximate a square root](20-newton.bas) | Science | Advanced | `INPUT`, `ABS`, `IF`, `GOTO`, `iteration` |

## 01 · Hello, TI-74

Your first program: display a message and keep it on the screen.

[Download program](01-hello.bas)

**Run:** Press RUN and ENTER. Read the message; press ENTER to end the pause.

**Expected output:** HELLO, TI-74!

- Line 10 is a comment; it produces no output.
- Line 20 combines PRINT and PAUSE on one line, separated by a colon.
- PAUSE lets you read the output before continuing.

**Try it:** Change the text in quotation marks. Use up to 31 characters to fit the display.

## 02 · Expressions and order of operations

Compare operations with and without parentheses, and combine powers with square roots.

[Download program](02-arithmetic.bas)

**Run:** Press RUN and ENTER. Press ENTER between the two screens and again at the end.

**Expected output:** First: A=14 and B=20. Then: C=41.

- Line 20 uses LET; later assignments omit this optional keyword.
- A multiplies before adding. B uses parentheses to add first.
- C combines 2 to the fifth power with the square root of 81.

**Try it:** Replace 2^5 with 2^8 and predict the new value of C before running.

## 03 · Add the numbers from 1 to 10

A counter and an accumulator demonstrate the structure of a loop.

[Download program](03-sum.bas)

**Run:** Press RUN and ENTER. The total stays visible until you press ENTER.

**Expected output:** SUM=55

- Line 20 initializes S before the loop.
- Lines 30–50 step through I from 1 to 10 and add each value to S.
- After the program ends, type S and press ENTER to inspect the variable.

**Try it:** Change the upper limit to 100. The total should become 5,050.

## 04 · Countdown

A negative step runs a loop in reverse order.

[Download program](04-countdown.bas)

**Run:** Press RUN and ENTER. Press ENTER to step through 3, 2, 1, and GO.

**Expected output:** 3 → 2 → 1 → GO

- Line 20 uses STEP -1 to decrease the counter.
- The pause is inside the loop: each number waits for ENTER.

**Try it:** Start at 10 and use STEP -2. Which values appear?

## 05 · Temperature converter

Ask the user for a value and convert it to another unit.

[Download program](05-temperature.bas)

**Run:** Press RUN and ENTER. At CELSIUS?, type 25 and press ENTER. Press ENTER again to close the result.

**Expected output:** With 25: F=77. With -40: F=-40.

- Line 20 displays a prompt and stores the answer in C.
- Line 30 applies F=C×9/5+32; use a period as the decimal separator.

**Try it:** Convert in the other direction: ask for F and calculate (F-32)*5/9.

## 06 · Validate and decide: odd or even

Validate an integer and choose one of two responses.

[Download program](06-decisions.bas)

**Run:** Press RUN and ENTER. Enter an integer from 0 to 100. Also try -1 or 2.5; press ENTER after the error message to try again.

**Expected output:** 7 → ODD; 8 → EVEN. Invalid values display INTEGER FROM 0 TO 100.

- Line 30 rejects negatives, values above 100, and numbers with a fractional part.
- Line 40 compares N with twice the integer part of N/2.
- GOTO 20 returns to the prompt after invalid input.

**Try it:** Change the test to identify multiples of 3.

## 07 · Slice, join, and search text

Explore the string operations available in this BASIC dialect.

[Download program](07-strings.bas)

**Run:** Press RUN and ENTER. Press ENTER to advance between the two results.

**Expected output:** BASIC / ALC; then LEN=8 and POS=5.

- A$ and B$ are string variables.
- Line 30 builds B$ from two parts of A$ using the & operator.
- Line 50 measures the text and searches for CAL starting at position 1.

**Try it:** Change BASICALC to CALCULATOR and adjust the slices.

## 08 · Text, character codes, and numbers

Convert characters to codes and numeric strings to values.

[Download program](08-ascii.bas)

**Run:** Press RUN and ENTER. Press ENTER to see each result.

**Expected output:** ASCII=65; LETTER=B; DOUBLE=25.

- ASC converts A to its character code; CHR$ converts the next code to B.
- VAL converts 12.5 from text to a number before multiplication.
- STR$ lets you join a numeric result to a message.

**Try it:** Replace A with Z and see which character comes next.

## 09 · Read and reread a data table

Store a small table in the program and restart reading it.

[Download program](09-data.bas)

**Run:** Press RUN and ENTER. Press ENTER to advance from the total to the first item read again.

**Expected output:** TOTAL=30; FIRST=4.

- Line 20 contains four values; READ consumes one at a time.
- RESTORE 20 returns to the beginning of the table.
- DATA is on its own line.

**Try it:** Change the four values and check the new total.

## 10 · Mean and standard deviation

Store observations in an array and calculate descriptive statistics in two passes.

[Download program](10-statistics.bas)

**Run:** Press RUN and ENTER. Press ENTER to advance from the mean to the population standard deviation.

**Expected output:** MEAN=5; STDDEV=2.

- Line 20 allocates A(0) through A(8); this example uses indices 1 through 8.
- Lines 100–120 accumulate squared differences from the mean.
- Line 130 divides by 8 to calculate the population standard deviation.

**Try it:** For the sample standard deviation of the same data, divide by 7 before applying SQR.

## 11 · A 2 × 2 matrix

Use two indices and nested loops to calculate a determinant.

[Download program](11-matrix.bas)

**Run:** Press RUN and ENTER. Press ENTER to close the determinant result.

**Expected output:** DET=-2 for the matrix [1, 2; 3, 4].

- Line 20 allocates a matrix; indices 1 and 2 are used in each dimension.
- Lines 40–80 fill one row at a time.
- Line 90 subtracts the product of the secondary diagonal from the product of the main diagonal.

**Try it:** Use the data 1,0,0,1: the identity matrix has determinant 1.

## 12 · Reuse a subroutine

Calculate two hypotenuses using the same block of code.

[Download program](12-gosub.bas)

**Run:** Press RUN and ENTER. Press ENTER to advance from the first hypotenuse to the second.

**Expected output:** H1=5; H2=13.

- GOSUB 200 calls the subroutine, and RETURN goes back to the next statement.
- A, B, and H are shared with the main program.
- GOTO 900 prevents execution from falling through into the subroutine again.

**Try it:** Change the second pair to 8 and 15. The hypotenuse will be 17.

## 13 · A subprogram with parameters

Put an operation in a named subprogram with arguments.

[Download program](13-subprogram.bas)

**Run:** Press RUN and ENTER. Read the result and press ENTER.

**Expected output:** DOUBLE=14

- Line 30 passes A and B to the DOUBLE subprogram.
- Lines 100–120 use X and Y as parameters; assigning to Y returns the result in B.
- The subprogram appears after the END of the main program.

**Try it:** Call DOUBLE again, using B as input and another variable as output.

## 14 · Angles and logarithms

Compare degrees with radians and check inverse functions.

[Download program](14-science.bas)

**Run:** Press RUN and ENTER. Press ENTER to advance through the three screens. The program restores DEG before finishing.

**Expected output:** DEGREES=.5; RADIANS=.5; LOG=3 and LNEXP=2.

- DEG and RAD explicitly set the angle unit before calculating SIN.
- PI/6 radians equals 30 degrees.
- LOG(1000) uses base 10; LN reverses EXP.

**Try it:** Compare SIN(90) in DEG mode with SIN(PI/2) in RAD mode.

## 15 · Format numbers

Control decimal places with a format stored in an IMAGE line.

[Download program](15-formatting.bas)

**Run:** Press RUN and ENTER. Press ENTER to advance from 12.50 to 3.14.

**Expected output:** 12.50; 3.14, aligned in the same field.

- Line 100 defines the format on its own line.
- PRINT USING reuses the same format for two numbers.
- The format changes the display without changing the value stored in A.

**Try it:** Replace ###.## with ###.### and observe the zeros and rounding.

## 16 · Roll two dice

Turn pseudorandom numbers into integers from 1 to 6.

[Download program](16-dice.bas)

**Run:** Press RUN and ENTER. View the two dice, then press ENTER to see their sum.

**Expected output:** Each die is in the range 1–6; their sum is in the range 2–12. The seed 74 makes the experiment repeatable.

- Line 20 sets the seed to make the demonstration reproducible.
- INT(6*RND)+1 turns a fraction into a die roll.
- RND is used without parentheses.

**Try it:** Change the seed. For a 20-sided die, replace 6 with 20.

## 17 · Sort five values

A bubble sort combines arrays, loops, and decisions.

[Download program](17-sorting.bas)

**Run:** Press RUN and ENTER. Press ENTER to step through the five sorted values.

**Expected output:** 1 → 2 → 4 → 7 → 9

- Lines 40–60 load the data into the array.
- Lines 70–110 compare neighbors and use T as a temporary variable when swapping.
- The limit 5-I reduces the work on each pass.

**Try it:** Replace > with < on line 90 to sort in descending order.

## 18 · Position text on the LCD

Build a text bar and write starting at a chosen column.

[Download program](18-display.bas)

**Run:** Press RUN and ENTER. Read the title and bar; press ENTER to advance to the message at column 8.

**Expected output:** TI-74 followed by eight asterisks; then COLUMN 8 starts at the eighth position.

- Line 20 clears the line; the semicolon keeps its contents for the next write.
- Line 30 places the bar starting at column 10.
- RPT$ creates eight asterisks without typing each one.

**Try it:** Replace 8 with 15 in RPT$ and move the bar using AT.

## 19 · Read a key without ENTER

Show a character as soon as it is typed, along with its character code.

[Download program](19-keyboard.bas)

**Run:** Press RUN and ENTER. At PRESS A LETTER, press A without ENTER. Then use ENTER to advance through the results.

**Expected output:** KEY=A and CODE=65 for uppercase A; lowercase a has code 97.

- Line 30 waits for a keyboard character.
- The response does not require ENTER.
- The code depends on the letter and the uppercase setting of the TI-74.

**Try it:** Try a digit or a punctuation mark.

## 20 · Approximate a square root

Implement Newton’s method and compare the result with SQR.

[Download program](20-newton.bas)

**Run:** Press RUN and ENTER. Enter 2; press ENTER to advance from the approximation to SQR(2). Values must be greater than 0 and no greater than 1,000,000. Enter numbers without thousands separators.

**Expected output:** With 2: about 1.414213562 on both screens. With 81: 9.

- Lines 20–30 validate the range used in this demonstration.
- Line 60 calculates a new approximation from the previous one.
- Lines 70–90 repeat until the difference is small or 40 iterations have been reached.

**Try it:** Change the tolerance 1E-9 and inspect I after the program to compare the iteration count.

## Maintenance and verification

Edit `programs/en-US/library.json`, then run `node tools/localize.cjs` from the project root to update the `.bas` files, this guide, and both English HTML files. `node tools/localize.cjs --check` checks synchronization without writing.

Run `node tests/library.test.cjs --en-US` to enter and execute all 20 examples through the keyboard using the ROMs already embedded in `TI-74.en-US.html`. The test also accepts paths to local CPU and system ROM files. Tests do not contain firmware copies.

Syntax reference: [Texas Instruments, TI-74 Programming Reference Guide](https://es.scribd.com/document/500278634/TI-74-Programming-Reference-Guide). The programs and explanations are original; they are not transcriptions of the manual examples.

These examples cover features available in this emulator. Cassette storage, printers, DOCK-BUS, and RAM cartridges are not implemented.
