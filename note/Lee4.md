下面是根据你上传的课件 **《Lec_4_Software Design Methods and Design Paradigms》** 生成的 **详细中英双语学习笔记（Markdown格式）**。
✅ 每个知识点都完整保留，英文+中文解释逐句对应，适合学习与复习使用。

---

# 🧩 Lecture 4 – Software Design Methods and Design Paradigms

**第四讲：软件设计方法与设计范式**

---

## 📖 1. Review of Previous Lecture

**上节课回顾**

* **Good Design** — 好的设计
* **Quality Attributes of Software Design** — 软件设计的质量属性
* **Software Design Principles** — 软件设计原则
* **Concepts in Design** — 设计中的基本概念

---

## 🧭 2. Outline of This Lecture

**本讲提纲**

1. Software Design Methods （软件设计方法）
2. Design Paradigms （设计范式）
3. Typical Design Trade-offs （典型设计权衡）

---

## 🏗️ 3. Software Design Methods

**软件设计方法**

### Definition

In a software development process, the **Software Design Methodology (SDM)** refers to a specific set of procedures used to manage and control the **Software Development Life Cycle (SDLC)**.
在软件开发过程中，**软件设计方法论（SDM）**是指用于管理和控制**软件开发生命周期（SDLC）**的一系列具体过程和步骤。

---

### Factors Influencing SDM Choice

选择哪种SDM主要取决于以下因素：

* **Type of Software**（软件类型）

  * Standalone or distributed / networked （独立或分布式/联网系统）
  * Strategic or operational （战略性或操作性系统）

* **Scope of Development Project**（开发项目范围）

  * Revamp of an existing system or a new system （改造旧系统或新建系统）
  * Number of modules （模块数量）
  * Coding complexity, testing, and implementation （代码复杂度、测试与实现）

* **Resource Constraints**（资源限制）

  * Time（时间）、Money（资金）、Expertise（专业技能）

---

### Main Design Methods

**主要的软件设计方法：**

1. **Structured (Function-Oriented) Design**
   结构化（面向功能）设计

2. **Object-Oriented Design (OOD)**
   面向对象设计

3. **Data-Oriented (Data-Structure-Centered) Design**
   数据导向（以数据结构为中心）设计

4. **Component-Based Design**
   基于组件的设计

5. **Formal Methods**
   形式化方法（数学化验证设计正确性）

---

### Method Overviews

**各方法概述：**

#### 1. Structured Methods

Identify and decompose **process functions**.
识别并分解系统的**过程函数**。

#### 2. Object-Oriented Methods

Develop an **object model** of the system.
建立系统的**对象模型**。

#### 3. Data-Oriented Methods

Determine entities in each subsystem and examine their interrelationships to develop supporting entities.
确定子系统中的**数据实体**及其**关系**，并建立支撑实体。

#### 4. Component-Based Methods

Divide the system into **independent components**.
将系统划分为**独立的组件模块**。

#### 5. Formal Methods

Translate requirements and programs into **mathematical notation** for verification.
将需求与程序**转化为数学形式**以便验证其正确性。

---

### Choosing a Design Method

**如何选择设计方法？**

| Method                     | Best For                                                                         | 中文说明                   |
| -------------------------- | -------------------------------------------------------------------------------- | ---------------------- |
| **Data-Oriented Design**   | Systems processing large volumes of data, e.g. databases or banking applications | 适用于处理大量数据的系统，如数据库或银行系统 |
| **Structured Design**      | Process-intensive systems using procedural languages (e.g. C)                    | 适用于以过程为主的系统，常用过程语言编写   |
| **Object-Oriented Design** | Systems developed using OO languages (e.g. C++)                                  | 适用于使用面向对象语言开发的系统       |
| **Component-Based Design** | Large modularized systems                                                        | 适用于可模块化的大型系统           |
| **Formal Methods**         | Mathematically rigorous, but costly and complex                                  | 理论严谨但成本高、复杂度大，目前仍在研究中  |

---

## 🧩 4. Software Design Paradigms

**软件设计范式**

### Main Paradigms

1. Structured / Function-Oriented Design （结构化 / 功能导向设计）
2. Object-Oriented Design （面向对象设计）

---

### 🧮 Structured / Procedural Paradigm

**结构化 / 过程式设计范式**

* **Focus:** Procedures and functions （关注程序的过程与功能）
* **Approach:** Top-down algorithmic decomposition （自顶向下的算法分解）
* **Separation:** Data is separated from procedures （数据与过程分离）

#### Example

* Identify main process → Decompose into smaller functions → Implement each function
* 确定主要流程 → 分解为较小函数 → 实现每个功能模块

#### Drawbacks / 缺点

* High **interdependencies** between functions （函数之间耦合度高）
* Hard to **reuse** functions （难以重用）
* Data not attached to functions （数据与函数脱节）

---

### 🧱 Object-Oriented Paradigm

**面向对象设计范式**

Describe the system as a collection of **collaborating objects** with specific **responsibilities**.
将系统描述为一组**协作对象**，每个对象承担特定职责。

**Key Concepts / 核心概念：**

* Object（对象）
* Class（类）
* Encapsulation（封装）
* State（状态）
* Inheritance（继承）
* Composition（组合）
* Polymorphism（多态）

---

### Object-Oriented Design Process

**面向对象设计过程**

* **Bottom-up approach** （自底向上）
* Encapsulate data and operations in classes （将数据与操作封装在类中）
* Combine classes into larger systems through refinement （通过细化组合形成更大系统）

---

### Benefits of Object-Oriented Design

**面向对象设计的优点**

| Benefit                  | Description                                   | 中文说明        |
| ------------------------ | --------------------------------------------- | ----------- |
| **Modularity**           | System is divided into smaller units          | 模块化结构       |
| **Reusability**          | Classes can be reused in future projects      | 类可重用        |
| **Naturalness**          | Models real-world entities easily             | 自然贴近现实      |
| **Maintainability**      | Easier to modify and extend                   | 更易维护        |
| **Reduced Dependencies** | Achieved through inheritance and polymorphism | 通过继承与多态降低耦合 |

⚠️ *If OO design is incorrect, implementation becomes overly complex.*
⚠️ 若面向对象设计错误，实现将变得极其复杂。

---

## 🔥 5. Case Study: Fire Alarm System

**案例研究：火警报警系统**

### Problem Description

A large building owner wants a computerized fire alarm system.
一栋大型建筑的业主希望建立计算机化火警系统。

* Smoke detectors and alarms in each room （每个房间安装烟雾探测器与警报器）
* System monitors all detectors’ statuses （系统监控所有探测器状态）
* When fire detected → Identify location → Sound nearby alarms only
  （当检测到火情 → 确定位置 → 仅在相邻区域响铃）
* Console shows alert message; firefighters can reset alarms after handling.
  （控制台显示警报信息，消防人员可复位警报）

---

### 🔹 Function-Oriented Approach

**面向功能的设计方法**

```c
/* Global data (system state) accessible by various functions */
/* 全局数据，系统状态，被多个函数访问 */
BOOL detector_status[MAX_ROOMS];
int detector_locs[MAX_ROOMS];
BOOL alarm_status[MAX_ROOMS];
int alarm_locs[MAX_ROOMS];
int neighbor_alarm[MAX_ROOMS][10]; /* 每个探测器最多有10个邻近位置 */
```

**Functions operating on system state / 操作系统状态的函数：**

```
interrogate_detectors();
get_detector_location();
report_fire_location();
determine_neighbor();
ring_alarm();
reset_alarm();
```

---

### 🔹 Object-Oriented Approach

**面向对象的设计方法**

```plaintext
class detector
  attributes: status, location, neighbors
  operations: create, sense_status, get_location, find_neighbors

class alarm
  attributes: location, status
  operations: create, ring_alarm, get_location, reset_alarm
```

---

### Comparison: Structured vs. Object-Oriented

**结构化设计 vs. 面向对象设计**

| Aspect               | Structured Design       | Object-Oriented Design            |
| -------------------- | ----------------------- | --------------------------------- |
| **Data & Functions** | Kept separate （数据与函数分离） | Combined within objects （数据与方法封装） |
| **Abstraction**      | In functions （函数抽象）     | In objects （对象抽象）                 |
| **Reusability**      | Low （低）                 | High （高）                          |
| **Coupling**         | High （高）                | Low （低）                           |
| **Design Focus**     | Process flow （过程逻辑）     | Real-world modeling （现实建模）        |

---

## ⚖️ 6. Design Goals and Trade-offs

**设计目标与权衡**

### Common Design Goals

**常见设计目标：**
Reliability（可靠性）
Modifiability（可修改性）
Maintainability（可维护性）
Understandability（可理解性）
Adaptability（可适应性）
Reusability（可重用性）
Efficiency（效率）
Portability（可移植性）
Traceability（可追溯性）
Fault Tolerance（容错性）
Backward Compatibility（向后兼容性）
Cost-Effectiveness（成本效益）
Robustness（健壮性）
Performance（性能）
Documentation（文档完善性）
Well-Defined Interfaces（接口清晰）
User-Friendliness（用户友好性）
Low Cost（低成本）
Flexibility（灵活性）

---

### Relationships Among Goals

**目标之间的关系**

> Some goals may **conflict** (e.g., Efficiency vs. Portability), requiring trade-offs.
> 一些目标可能**相互冲突**（如效率与可移植性），需要在设计中权衡取舍。

---

### Typical Design Trade-offs

**典型设计权衡**

| Trade-off                              | Explanation                                 | 中文说明         |
| -------------------------------------- | ------------------------------------------- | ------------ |
| Functionality vs. Usability            | More features may reduce ease of use        | 功能多可能降低可用性   |
| Cost vs. Robustness                    | Higher robustness costs more                | 健壮性越高成本越高    |
| Efficiency vs. Portability             | Optimized code may not be portable          | 高效代码往往不通用    |
| Rapid Development vs. Functionality    | Speed vs. completeness                      | 快速开发与功能完善的取舍 |
| Cost vs. Reusability                   | Reusable design increases initial cost      | 可重用性提高初期投入   |
| Backward Compatibility vs. Readability | Supporting legacy code makes design complex | 向后兼容使代码更复杂难读 |

---

## 🧾 7. Summary

**总结**

| Topic                       | Key Points                                                          | 中文要点                    |
| --------------------------- | ------------------------------------------------------------------- | ----------------------- |
| **Software Design Methods** | Structured, Object-Oriented, Data-Oriented, Component-Based, Formal | 结构化、面向对象、数据导向、组件化、形式化方法 |
| **Design Paradigms**        | Function-Oriented vs. Object-Oriented                               | 面向功能 vs 面向对象            |
| **Trade-offs**              | Cost, performance, reusability, and maintainability                 | 成本、性能、可重用性与可维护性的平衡      |

---

✅ **End of Lecture 4 Notes – Software Design Methods & Design Paradigms**
**第四讲学习笔记完毕：软件设计方法与设计范式**

---

是否希望我接下来继续为你撰写一份 **“Lecture 4 + Lecture 5 综合总结笔记”**（完整中英对照，侧重对比架构与设计方法的区别）？这有助于复习考试和论文答辩。
