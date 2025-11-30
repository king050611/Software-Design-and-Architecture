class Circuitequeue:
    def __init__ (self,size):
        self.size = size
        self.queue = [None] * size
        self.front = -1
        self.rear = -1
    def enqueue(self, item):
        if (self.rear + 1) % self.size == self.front:
            print("队列已满，无法入队！")
            return

        if self.front == -1:  
            self.front = 0

        self.rear = (self.rear + 1) % self.size
        self.queue[self.rear] = item
        print(f"入队: {item}")

    def dequeue(self):
        if self.front == -1:
            print("队列为空，无法出队！")
            return None

        item = self.queue[self.front]
        if self.front == self.rear:  # 只有一个元素时
            self.front = -1
            self.rear = -1
        else:
            self.front = (self.front + 1) % self.size
        print(f"出队: {item}")
        return item
     # 显示队列
    def display(self):
        if self.front == -1:
            print("队列为空！")
            return

        print("队列内容:", end=" ")
        i = self.front
        while True:
            print(self.queue[i], end=" ")
            if i == self.rear:
                break
            i = (i + 1) % self.size
        print()


# 测试程序
if __name__ == "__main__":
    cq = Circuitequeue(5)

    # 入队操作
    cq.enqueue(10)
    cq.enqueue(20)
    cq.enqueue(30)
    cq.enqueue(40)
    cq.display()

    # 出队操作
    cq.dequeue()
    cq.dequeue()
    cq.display()

    # 继续入队，测试循环效果
    cq.enqueue(50)
    cq.enqueue(60)
    cq.display()

    # 再次入队，队列满
    cq.enqueue(70)
    cq.display()