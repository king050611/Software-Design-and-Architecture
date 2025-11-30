def calculate_ages():
    """
    计算三个表兄弟的年龄
    丹妮比杰森大4岁，杰克的年龄是丹妮的一半
    """
    try:
        # 获取杰森的年龄作为输入
        jason_age = float(input("请输入杰森的年龄: "))
        
        # 验证输入是否有效
        if jason_age < 0:
            print("错误：年龄不能为负数")
            return
        
        # 计算丹妮的年龄（比杰森大4岁）
        dany_age = jason_age + 4
        
        # 计算杰克的年龄（丹妮年龄的一半）
        jack_age = dany_age / 2
        
        # 输出结果
        print(f"杰森的年龄: {jason_age}岁")
        print(f"丹妮的年龄: {dany_age}岁")
        print(f"杰克的年龄: {jack_age}岁")
        
    except ValueError:
        print("错误：请输入有效的数字")

# 调用函数
if __name__ == "__main__":
    calculate_ages()