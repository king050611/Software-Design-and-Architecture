def rice_bag_calculator():
    # 定义常量（1公吨=2205磅）
    POUNDS_PER_TON = 2205.0
    
    # 获取用户输入
    user_input = input("请输入每袋大米的重量（磅）: ")
    
    # 验证输入是否为数字
    if not user_input.replace('.', '', 1).isdigit():
        print("错误：请输入有效的数字")
        return
    
    # 转换为浮点数
    bag_weight = float(user_input)
    
    
    # 计算袋子数量（不使用内置函数）
    # 计算整数部分
    whole_bags = int(POUNDS_PER_TON // bag_weight)
    
    # 计算余数
    remainder = POUNDS_PER_TON % bag_weight
    
    # 向上取整逻辑
    if remainder > 0:
        bags_needed = whole_bags + 1
    else:
        bags_needed = whole_bags
    
    # 输出结果
    print(f"储存一公吨大米所需的袋子数量为: {bags_needed}")

# 主程序入口
if __name__ == "__main__":
    rice_bag_calculator()