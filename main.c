/* Beginner DSA project: Postfix Expression Evaluator using a Stack in C.
   Supports single-digit operands and +, -, *, / operators.
   Example input: 23*5+  -> output: 11
   Compile: gcc main.c -o evaluator
*/
#include <stdio.h>
#include <ctype.h>
#include <string.h>

#define MAX 100

int stack[MAX];
int top = -1;

void push(int value)
{
    if (top == MAX - 1) {
        printf("Stack is full!\n");
        return;
    }
    stack[++top] = value;
}

int pop(void)
{
    if (top == -1) {
        printf("Invalid expression: stack is empty.\n");
        return 0;
    }
    return stack[top--];
}

int main(void)
{
    char expression[MAX];
    int i, a, b;

    printf("EXPRESSION EVALUATOR USING STACKS\n");
    printf("Enter postfix expression (example: 23*5+): ");
    if (scanf("%99s", expression) != 1) {
        printf("No expression entered.\n");
        return 1;
    }

    for (i = 0; expression[i] != '\0'; i++) {
        if (isdigit((unsigned char)expression[i])) {
            push(expression[i] - '0');
        } else if (strchr("+-*/", expression[i]) != NULL) {
            if (top < 1) {
                printf("Invalid expression: not enough operands.\n");
                return 1;
            }
            b = pop();
            a = pop();

            switch (expression[i]) {
                case '+': push(a + b); break;
                case '-': push(a - b); break;
                case '*': push(a * b); break;
                case '/':
                    if (b == 0) {
                        printf("Error: division by zero.\n");
                        return 1;
                    }
                    push(a / b);
                    break;
            }
        } else {
            printf("Invalid character: %c\n", expression[i]);
            return 1;
        }
    }

    if (top != 0) {
        printf("Invalid expression.\n");
        return 1;
    }

    printf("Result = %d\n", pop());
    return 0;
}
