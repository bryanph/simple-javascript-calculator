A simple JavaScript calculator

https://calculator.bryanph.me/

Some potential improvement paths:

- The calculator can be made responsive for use on mobile
- Right now, the symbols in the input are in line with the JavaScript operators for those symbols (*, /, ^, etc.). It would be nice if the input instead showed a nicer representation of these symbols (for example $5^5$ instead of `5^5`)
- Instead of sanitizing the input, it could show an error when the input is false
- The calculator could provide support for more functions to make it more useful, such as $sin$, $cos$, etc.
- There are some performance optimizations possible like separating the event listener in the initialization loop, so there's only one function being created
- Instead of using eval, could control input more so that it's easier to validate
- It could handle Infinity (right now it just sanitizes it away)
