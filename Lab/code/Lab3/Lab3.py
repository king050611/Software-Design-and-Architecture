import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from datetime import datetime, timedelta
import threading
import time
import re

class TodoApp:
    def __init__(self, root):
        # 设置主窗口
        self.root = root
        self.root.title("高级待办事项列表")
        self.root.geometry("750x500")
        self.root.resizable(True, True)
        
        # 确保中文显示正常
        self.style = ttk.Style()
        self.style.configure("TLabel", font=("SimHei", 10))
        self.style.configure("TButton", font=("SimHei", 10))
        self.style.configure("TEntry", font=("SimHei", 10))
        self.style.configure("TRadiobutton", font=("SimHei", 10))
        
        # 创建优先级样式
        self.style.configure("High.TFrame", background="#ffcccc")  # 浅红色
        self.style.configure("Medium.TFrame", background="#ffffcc")  # 浅黄色
        self.style.configure("Low.TFrame", background="#ccffcc")   # 浅绿色
        
        # 为标签创建对应优先级的样式
        self.style.configure("High.TLabel", background="#ffcccc")
        self.style.configure("Medium.TLabel", background="#ffffcc")
        self.style.configure("Low.TLabel", background="#ccffcc")
        
        # 创建待办事项列表 - 存储字典对象
        self.todo_list = []
        self.task_counter = 0  # 使用独立计数器确保ID唯一
        
        # 创建UI组件
        self.create_widgets()
        
        # 启动提醒检查线程
        self.reminder_thread = threading.Thread(target=self.check_reminders, daemon=True)
        self.reminder_thread.start()
    
    def create_widgets(self):
        # 顶部框架：添加新任务
        top_frame = ttk.LabelFrame(self.root, text="添加新任务", padding="10")
        top_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # 任务名称
        ttk.Label(top_frame, text="任务名称:").grid(row=0, column=0, padx=5, pady=5, sticky=tk.W)
        
        self.task_entry = ttk.Entry(top_frame)
        self.task_entry.grid(row=0, column=1, columnspan=3, padx=5, pady=5, sticky=tk.EW)
        self.task_entry.focus()  # 设置焦点到输入框
        
        # 优先级
        ttk.Label(top_frame, text="优先级:").grid(row=1, column=0, padx=5, pady=5, sticky=tk.W)
        
        self.priority_var = tk.StringVar(value="中")
        priorities = [("高", "高"), ("中", "中"), ("低", "低")]
        
        for i, (text, value) in enumerate(priorities):
            ttk.Radiobutton(
                top_frame, 
                text=text, 
                variable=self.priority_var, 
                value=value
            ).grid(row=1, column=i+1, padx=5, pady=5, sticky=tk.W)
        
        # 时间设置
        ttk.Label(top_frame, text="提醒时间 (YYYY-MM-DD HH:MM):").grid(row=2, column=0, padx=5, pady=5, sticky=tk.W)
        
        self.time_entry = ttk.Entry(top_frame)
        self.time_entry.grid(row=2, column=1, padx=5, pady=5, sticky=tk.EW)
        self.time_entry.insert(0, datetime.now().strftime("%Y-%m-%d %H:%M"))
        
        # 备注按钮
        self.note_var = tk.StringVar(value="")
        note_btn = ttk.Button(
            top_frame, 
            text="添加备注", 
            command=self.add_note
        )
        note_btn.grid(row=2, column=2, padx=5, pady=5)
        
        # 添加按钮
        add_button = ttk.Button(
            top_frame, 
            text="添加任务", 
            command=self.add_task
        )
        add_button.grid(row=2, column=3, padx=5, pady=5)
        
        # 配置列权重，使输入框可拉伸
        top_frame.columnconfigure(1, weight=1)
        
        # 中间框架：任务列表
        self.mid_frame = ttk.LabelFrame(self.root, text="任务列表", padding="10")
        self.mid_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        # 创建滚动条
        scrollbar = ttk.Scrollbar(self.mid_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # 创建任务列表框架（用于放置所有任务）
        self.tasks_canvas = tk.Canvas(self.mid_frame, yscrollcommand=scrollbar.set)
        self.tasks_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # 任务框架（放在canvas内）
        self.tasks_frame = ttk.Frame(self.tasks_canvas)
        self.tasks_canvas.create_window((0, 0), window=self.tasks_frame, anchor="nw")
        
        # 绑定滚动事件
        scrollbar.config(command=self.tasks_canvas.yview)
        self.tasks_frame.bind("<Configure>", self._on_frame_configure)
        self.tasks_canvas.bind("<Configure>", self._on_canvas_configure)
        
        # 底部框架：状态信息
        bottom_frame = ttk.Frame(self.root, padding="10")
        bottom_frame.pack(fill=tk.X, padx=10, pady=5)
        
        self.status_label = ttk.Label(bottom_frame, text="当前没有任务")
        self.status_label.pack(side=tk.LEFT)
        
        # 排序按钮
        sort_btn = ttk.Button(
            bottom_frame, 
            text="按优先级排序", 
            command=self.sort_tasks
        )
        sort_btn.pack(side=tk.RIGHT, padx=5)
    
    def _on_frame_configure(self, event):
        # 更新canvas滚动区域
        self.tasks_canvas.configure(scrollregion=self.tasks_canvas.bbox("all"))
    
    def _on_canvas_configure(self, event):
        # 当canvas大小改变时，调整内部框架宽度
        self.tasks_canvas.itemconfig(self.tasks_canvas.create_window((0, 0), window=self.tasks_frame, anchor="nw"), width=event.width)
    
    def add_note(self):
        # 弹出对话框添加备注
        note = simpledialog.askstring("备注", "请输入任务备注:")
        if note is not None:  # 如果用户点击了确定而不是取消
            self.note_var.set(note)
    
    def validate_time_format(self, time_str):
        # 验证时间格式是否正确 (YYYY-MM-DD HH:MM)
        pattern = r'^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$'
        if not re.match(pattern, time_str):
            return False
        
        try:
            datetime.strptime(time_str, "%Y-%m-%d %H:%M")
            return True
        except ValueError:
            return False
    
    def add_task(self):
        # 获取输入的任务文本
        task_text = self.task_entry.get().strip()
        priority = self.priority_var.get()
        time_str = self.time_entry.get().strip()
        note = self.note_var.get().strip()
        
        # 验证输入
        if not task_text:
            messagebox.showwarning("警告", "任务名称不能为空!")
            return
            
        if not self.validate_time_format(time_str):
            messagebox.showwarning("警告", "时间格式不正确!\n请使用 YYYY-MM-DD HH:MM 格式")
            return
        
        # 解析时间
        try:
            reminder_time = datetime.strptime(time_str, "%Y-%m-%d %H:%M")
            if reminder_time < datetime.now():
                if not messagebox.askyesno("提示", "设置的时间已过去，是否仍然添加?"):
                    return
        except ValueError:
            messagebox.showwarning("警告", "无法解析时间!")
            return
        
        # 创建任务ID（使用独立计数器确保唯一性）
        self.task_counter += 1
        task_id = self.task_counter
        
        # 添加任务到列表
        task = {
            "id": task_id,
            "text": task_text,
            "priority": priority,
            "time": reminder_time,
            "note": note,
            "frame": None  # 稍后存储UI框架引用
        }
        self.todo_list.append(task)
        
        # 创建任务条目UI
        self.create_task_ui(task)
        
        # 按优先级排序
        self.sort_tasks()
        
        # 更新状态标签
        self.update_status()
        
        # 清空输入框
        self.task_entry.delete(0, tk.END)
        self.note_var.set("")
        # 保留优先级和时间，方便连续添加类似任务
    
    def create_task_ui(self, task):
        # 根据优先级选择样式
        style_map = {
            "高": "High.TFrame",
            "中": "Medium.TFrame",
            "低": "Low.TFrame"
        }
        label_style_map = {
            "高": "High.TLabel",
            "中": "Medium.TLabel",
            "低": "Low.TLabel"
        }
        
        frame_style = style_map.get(task["priority"], "TFrame")
        label_style = label_style_map.get(task["priority"], "TLabel")
        
        # 创建任务条目框架，使用对应的样式
        task_frame = ttk.Frame(self.tasks_frame, style=frame_style)
        
        # 任务文本标签
        task_label = ttk.Label(
            task_frame, 
            text=task["text"], 
            width=25,
            style=label_style
        )
        task_label.pack(side=tk.LEFT, padx=5, pady=2)
        
        # 优先级标签
        priority_label = ttk.Label(
            task_frame, 
            text=f"优先级: {task['priority']}", 
            width=12,
            style=label_style
        )
        priority_label.pack(side=tk.LEFT, padx=5, pady=2)
        
        # 时间标签
        time_label = ttk.Label(
            task_frame, 
            text=task["time"].strftime("%Y-%m-%d %H:%M"), 
            width=16,
            style=label_style
        )
        time_label.pack(side=tk.LEFT, padx=5, pady=2)
        
        # 备注按钮
        note_btn = ttk.Button(
            task_frame, 
            text="查看备注", 
            command=lambda t=task: self.show_note(t)
        )
        note_btn.pack(side=tk.LEFT, padx=2)
        
        # 完成按钮
        complete_btn = ttk.Button(
            task_frame, 
            text="完成", 
            command=lambda t=task: self.complete_task(t)
        )
        complete_btn.pack(side=tk.LEFT, padx=2)
        
        # 删除按钮
        delete_btn = ttk.Button(
            task_frame, 
            text="删除", 
            command=lambda t=task: self.delete_task(t)
        )
        delete_btn.pack(side=tk.LEFT, padx=2)
        
        # 保存框架引用
        task["frame"] = task_frame
        
        return task_frame
    
    def show_note(self, task):
        # 显示任务备注
        note = task["note"] if task["note"] else "无备注"
        messagebox.showinfo(f"{task['text']} 的备注", note)
    
    def sort_tasks(self):
        # 先清除所有任务UI
        for task in self.todo_list:
            if task["frame"]:
                task["frame"].destroy()
        
        # 按优先级排序（高 > 中 > 低），然后按时间排序
        priority_order = {"高": 0, "中": 1, "低": 2}
        self.todo_list.sort(key=lambda x: (priority_order[x["priority"]], x["time"]))
        
        # 重新创建所有任务UI
        for task in self.todo_list:
            task["frame"] = self.create_task_ui(task)
            task["frame"].pack(fill=tk.X, pady=2, ipady=2)
        
        # 更新滚动区域
        self._on_frame_configure(None)
    
    def complete_task(self, task):
        # 从列表中移除任务
        if task in self.todo_list:
            self.todo_list.remove(task)
        
        # 移除UI中的任务
        if task["frame"]:
            task["frame"].destroy()
        
        # 更新状态标签
        self.update_status()
        
        messagebox.showinfo("完成", f"恭喜你完成了: {task['text']}")
    
    def delete_task(self, task):
        # 确认删除
        if messagebox.askyesno("确认", f"确定要删除 '{task['text']}' 吗?"):
            # 从列表中移除任务
            if task in self.todo_list:
                self.todo_list.remove(task)
            
            # 移除UI中的任务
            if task["frame"]:
                task["frame"].destroy()
            
            # 更新状态标签
            self.update_status()
    
    def update_status(self):
        # 更新状态信息
        count = len(self.todo_list)
        if count == 0:
            self.status_label.config(text="当前没有任务")
        elif count == 1:
            self.status_label.config(text=f"还有1个任务待完成")
        else:
            self.status_label.config(text=f"还有{count}个任务待完成")
    
    def check_reminders(self):
        # 循环检查是否有任务需要提醒
        while True:
            now = datetime.now()
            # 检查未来2分钟内需要提醒的任务
            for task in self.todo_list:
                time_diff = task["time"] - now
                if timedelta(0) <= time_diff <= timedelta(minutes=2):
                    # 在主线程中显示提醒
                    self.root.after(0, self.show_reminder, task)
            
            # 每分钟检查一次
            time.sleep(60)
    
    def show_reminder(self, task):
        # 显示任务提醒
        if task in self.todo_list:  # 确保任务仍然存在
            message = f"任务提醒: {task['text']}\n"
            message += f"时间: {task['time'].strftime('%Y-%m-%d %H:%M')}\n"
            message += f"优先级: {task['priority']}\n"
            if task["note"]:
                message += f"备注: {task['note']}"
            
            messagebox.showinfo("任务提醒", message)

if __name__ == "__main__":
    root = tk.Tk()
    app = TodoApp(root)
    root.mainloop()
    