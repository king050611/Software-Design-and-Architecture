string = str(input("Enter a string: "))
string1 = sorted(string)  
freq_map = {}             

count = 1
for i in range(len(string1)):
    if i < len(string1) - 1 and string1[i] == string1[i+1]:
        count += 1
    else:
        freq_map[string1[i]] = count
        count = 1

# 输出结果
print("Character frequencies:")
for key in sorted(freq_map.keys()):
    print(f"{key}: {freq_map[key]}")
