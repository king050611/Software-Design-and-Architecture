def calculate_notes():
    # 输入取款金额（以百为单位）
    hundreds = int(input("请输入取款金额（百单位）: "))
    
    # 计算总金额（转换为元）
    total_amount = hundreds * 100
    
    # 初始化纸币面额
    denominations = [100, 50, 10]
    note_counts = [0, 0, 0]  # 对应100元、50元、10元的数量
    
    # 使用贪心算法计算每种面额的数量
    remaining = total_amount
    for i in range(len(denominations)):
        if remaining >= denominations[i]:
            note_counts[i] = remaining // denominations[i]
            remaining %= denominations[i]
    
    # 输出结果
    print(f"100元纸币数量: {note_counts[0]}")
    print(f"50元纸币数量: {note_counts[1]}")
    print(f"10元纸币数量: {note_counts[2]}")
    
    # 检查是否有剩余金额（理论上应为0，因为金额是100的倍数）
    if remaining > 0:
        print(f"注意: 有{remaining}元无法用给定面额凑整")

# 调用函数
if __name__ == "__main__":
    calculate_notes()