class calculator:
    def add(self,a,b):
        return a+b
    def subtract(self,a,b):
        return a-b
    def multiply(self,a,b):
        return a*b
    def divide(self,a,b):
        if b!=0:
            return a/b
        else:
            return "Error! Division by zero."
calc = calculator()
number1=input("Enter first number: ")
number2=input("Enter second number: ")
operation=input("Enter operation (+, -, *, /): ")
try:
    num1=float(number1)
    num2=float(number2)
    if operation=='+':
        result=calc.add(num1,num2)
    elif operation=='-':
        result=calc.subtract(num1,num2)
    elif operation=='*':
        result=calc.multiply(num1,num2)
    elif operation=='/':
        result=calc.divide(num1,num2)
    else:
        result="Invalid operation!"
    print("Result:",result)
except ValueError:
    print("Invalid input! Please enter numeric values.")