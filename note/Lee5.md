Here’s a **complete bilingual (English + Chinese)** study note in **Markdown** format for your PPT **“Lec 5 – Introduction to Software Architecture”**.
It covers **every concept** mentioned in your slides — nothing is skipped.

---

# 🏗️ Lecture 5: Introduction to Software Architecture

**软件架构导论**

---

## 📘 1. Review / 复习

### Software Design Methods

**Software design methods** refer to systematic approaches used to transform requirements into a blueprint for building software systems.
**软件设计方法**是将需求转化为软件系统设计蓝图的系统化方法。

* Examples include:

  * Structured Design (结构化设计)
  * Object-Oriented Design (面向对象设计)
  * Component-Based Design (基于组件的设计)
  * Service-Oriented Design (面向服务的设计)

### Design Paradigms

A **design paradigm** is a general style or philosophy of organizing and structuring design.
**设计范式**是一种组织和构造设计的总体思路或哲学。

Common paradigms include:

* Functional / Procedural Design （功能化 / 过程化设计）
* Object-Oriented Design （面向对象设计）
* Event-Driven Design （事件驱动设计）
* Layered Design （分层设计）

### Typical Design Trade-offs

Software design involves **trade-offs** among performance, maintainability, scalability, and cost.
软件设计中通常需要在性能、可维护性、可扩展性和成本之间进行权衡。

---

## 🏛️ 2. Introduction to Software Architecture

**软件架构简介**

### Definition

> Software Architecture is the description of elements from which a system is built, their interactions, and the constraints on their composition.
> **软件架构**是对系统构建元素、元素之间交互及其组合约束的描述。

It views the system as a **collection of components** and their **interactions**.
它将系统视为由多个组件及其相互作用组成的整体。

---

## 🧩 3. Components and Interactions

**组件与交互**

* **Components（组件）**: Clients, servers, databases, layers, etc.
  客户端、服务器、数据库、层等。
* **Interactions（交互）**: Procedure calls, shared variable access, message passing, etc.
  过程调用、共享变量访问、消息传递等。

At the **architectural level**, designers must also consider:
在**架构层面**还需考虑：

* Capacity（容量）
* Consistency（一致性）
* Performance（性能）
* Scalability（可扩展性）

---

## 📏 4. IEEE Definition (1471–2000)

> The fundamental organization of a system embodied in its components, their relationships to each other and to the environment, and the principles guiding its design and evolution.
> **系统的基本组织结构**，体现在其组件、组件间及其与环境的关系，以及指导其设计与演化的原则中。

---

## 🧱 5. Architecture as a Blueprint

**架构作为系统蓝图**

Architecture provides an **abstraction** to manage complexity and communicate among components.
架构提供了一种**抽象层**，用于管理复杂性并协调各组件的通信。

It defines a **structured solution** that meets technical and operational requirements while optimizing quality attributes such as:
它定义了一种**结构化的解决方案**，满足技术与运行需求，并优化以下质量属性：

* Performance（性能）
* Security（安全性）
* Maintainability（可维护性）
* Scalability（可扩展性）

### Architectural Decisions Include

**架构决策包括：**

1. Selecting structural elements and interfaces (选择结构元素和接口)
2. Specifying behavior via collaborations (通过交互定义行为)
3. Composing elements into subsystems (将元素组成子系统)
4. Aligning design with business objectives (使设计与业务目标一致)
5. Choosing architectural styles (选择架构风格)

---

## ❓ 6. Key Architectural Questions

**关键架构问题**

* What is the nature of the elements? 元素的本质是什么？
* What are their responsibilities? 元素的职责是什么？
* What is the significance of connections? 连接的重要性是什么？
* What is the layout’s impact? 布局的意义是什么？

---

## 🧭 7. Architecture Design Origin

**架构设计的来源**

| Question                     | Answer                                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Where does it come from?** | Derived from the **system requirement specification** and **analysis model**. 来源于系统需求说明书与分析模型。                                     |
| **Who develops it?**         | Software architects and designers. 软件架构师与设计师。                                                                                      |
| **Why is it important?**     | Poor design can cause failures: not meeting requirements, not reusable, poor performance, etc. 设计不当可能导致系统失败：无法满足需求、不可重用、性能差。       |
| **When is it done?**         | Early phase of the **SDLC**. 在软件生命周期的早期阶段进行。                                                                                       |
| **What is the outcome?**     | A complete architectural specification with elements, connectors, constraints, and runtime behaviors. 输出完整的架构规范，包括元素、连接器、约束与运行时行为。 |

---

## ⚖️ 8. Architecture vs. Design

**架构与设计的区别**

> “All architecture is design, but not all design is architecture.”
> **所有架构都是设计，但不是所有设计都是架构。**

| Aspect     | Architecture                           | Design                             |
| ---------- | -------------------------------------- | ---------------------------------- |
| **Scope**  | System-level, high abstraction 系统级、高抽象 | Detailed component behavior 详细组件行为 |
| **Focus**  | Stakeholders’ needs 利益相关者需求            | Technology implementation 技术实现     |
| **Output** | System structure 系统结构                  | Internal logic 内部逻辑                |
| **Goal**   | Communication, consistency 沟通与一致性      | Completeness, precision 完整与精确      |

---

## 👨‍💻 9. Role of Software Architect

**软件架构师的角色**

### A. Design Expertise / 设计专长

* Mastery of design methods (掌握多种设计方法)
* Lead and coordinate team design integrity (领导与协调设计完整性)
* Evaluate design trade-offs (评估设计权衡)

### B. Domain Expertise / 领域专长

* Understand the domain and plan for evolution (理解领域并规划演进)
* Help ensure requirement completeness and consistency (确保需求完整性与一致性)
* Define the domain model (定义领域模型)

### C. Technology Expertise / 技术专长

* Select appropriate technology stacks (选择合适技术栈)
* Evaluate frameworks, languages, databases (评估框架、语言与数据库)

### D. Methodological Expertise / 方法论专长

* Choose SDLC methodology (选择合适的软件开发生命周期方法)
* Guide development approaches (指导开发策略)

### E. Hidden Roles / 隐性角色

* Facilitate team collaboration (促进团队协作)
* Share knowledge and experience (共享知识与经验)
* Protect team from distractions (保护团队免受干扰)

---

## 📦 10. Deliverables of the Architect

**架构师的交付成果**

1. Clear, consistent, and achievable goals （明确一致可实现的目标）
2. Functional description with at least two decomposition layers （功能描述，至少两层分解）
3. System concept and high-level design （系统概念与高层设计）
4. Timing, operation, and implementation plans （时序、操作与实现计划）
5. Controlled interface and decomposition documentation （受控接口与分解文档）

---

## 🌐 11. Architectural Influences

**架构影响因素**

| Influence Source            | Description                                      |
| --------------------------- | ------------------------------------------------ |
| **System stakeholders**     | End users, developers, managers 系统利益相关者          |
| **Developing organization** | Structure, processes, and culture 开发组织结构与文化      |
| **Architect’s experience**  | Knowledge, background, and biases 架构师的知识与经验      |
| **Technical environment**   | Available tools, platforms, and constraints 技术环境 |
| **Precautionary measures**  | Constraints and stakeholder engagement 限制条件与早期沟通 |

---

## 🔧 12. Architect’s Tasks

**架构师的主要任务**

1. **Static partitioning** – divide system into subsystems and define communication.
   **静态划分**：将系统分解为子系统并定义通信关系。
2. **Encapsulation and loose coupling.**
   **封装与松耦合**：通过接口屏蔽内部细节。
3. **Dynamic control relationships.**
   **动态控制关系**：设计数据流、控制流或消息分发机制。
4. **Evaluate architectural styles.**
   **评估架构风格**：选择最适合问题域的架构风格。
5. **Perform trade-off analysis.**
   **进行权衡分析**：在性能、扩展性、可维护性间平衡。

---

## 🔄 13. Architecture Business Cycle (ABC)

**架构业务循环**

### Definition

> Architecture is influenced by technical, business, and social factors, and it in turn influences them back.
> **架构受技术、商业和社会因素影响，同时反过来也影响这些因素。**

This feedback loop is called the **Architecture Business Cycle (ABC)**.
这种双向影响的循环称为**架构业务循环**。

---

### ABC Activities / 活动内容

1. **Creating the business case**
   Why a new system is needed; cost, integration, and market time.
   建立商业案例：为何需要新系统、成本、集成与上市时间。

2. **Understanding the requirements**
   Requirements elicitation via object-oriented, prototyping, etc.
   理解需求：通过面向对象、原型法等方式获取需求。

3. **Creating/selecting the architecture**
   Choose architectural style that satisfies qualities and trade-offs.
   创建或选择架构：基于需求与权衡确定架构风格。

4. **Communicating the architecture**
   Share architecture unambiguously with stakeholders.
   传达架构：清晰地向所有利益相关者说明。

5. **Analyzing/Evaluating the architecture**
   Evaluate design alternatives and trade-offs.
   分析与评估架构：对候选设计方案进行比较与取舍。

6. **Implementation and conformance**
   Ensure the system follows the designed architecture.
   实现与一致性：确保实现符合架构设计。

---

## 🧾 14. Summary / 总结

| Topic                            | Description                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------- |
| **Software Architecture**        | Structure and behavior of software components 软件组件的结构与行为                          |
| **Architecture vs Design**       | Architecture is system-level; design is detail-level 架构是系统层面，设计是细节层面              |
| **Architect’s Responsibilities** | Design, coordination, decision-making 设计、协调与决策                                    |
| **Architecture Business Cycle**  | Interaction between architecture and business/technical environment 架构与商业/技术环境的交互 |

---

