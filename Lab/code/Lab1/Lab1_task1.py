hours=int(input("Enter hours worked: "))
Rate=int(input("Enter hour rate: Rs."))

if hours>8:
    regular_pay=(8*Rate)+((hours-8)*Rate*1.5)
else:
    regular_pay=hours*Rate

print("The daily wage of worker is:",regular_pay)
