class student:
    def __init__(self, name, id, grade,store={}):
        self.name = name
        self.id = id
        self.grade = grade
        self.store = store
        self.store[id] = (name, grade)
    
    def search(self,id):
        if id in self.store:  # Access the instance variable store
            return self.store[id]
        else:
            return "not found"
    def save_to_file(self, filename="students.txt"):
        """把学生信息存到当前文件夹下，并带错误处理"""
        try:
            with open(filename, "w", encoding="utf-8") as f:
                for sid, (name, grade) in self.store.items():
                    f.write(f"ID: {sid}, Name: {name}, Grade: {grade}\n")
            print(f" 学生信息已保存")
        except Exception as e:
            print(f"保存文件时出错: {e}")


s1 = student("Alice", "001", 90)
s2 = student("Bob", "002", 85, s1.store)  # 共用同一个 store
s3 = student("Cathy", "003", 95, s1.store)

print(s1.search("002"))   # ('Bob', 85)
print(s1.search("004"))   # not found

s1.save_to_file()  # 存到 students.txt
