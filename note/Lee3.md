这是一个完全符合 **Markdown 格式** 的中英双语对照笔记，它保持了清晰的表格结构，并准确对应了您提供的 PPT 知识点。

---

## 软件设计质量属性笔记 (Quality Attributes of Software Design Notes)

---

### 1. 好的设计应具备的特性 (Good Design)

| 中文 (Chinese) | 英文 (English) |
| :--- | :--- |
| **效率 (Efficiency)** | **Efficiency** |
| 系统的响应速度，包括事件响应时间、单位时间内能处理的事件数量。 | System responsiveness, including event response time and the number of events handled per unit time. |
| 耗时点：组件间通信、组件执行间隔、组件计算时间。设计应减少无谓通信和等待。 | Time consumers: Inter-component communication, execution intervals, component computation time. Design should minimize unnecessary communication and waiting. |
| **正确性 (Correctness)** | **Correctness** |
| 软件必须实现用户需求。设计不符需求，软件即不正确。 | The software must fulfill user requirements. If the design is faulty, the software is incorrect, even if perfectly implemented. |
| **可靠性 (Reliability)** | **Reliability** |
| 系统在一定环境和时间内正确完成功能的概率。强调按用户期望持续稳定运行。 | The probability of the system performing its function correctly under specified conditions for a defined period. Emphasizes continuous, stable operation "as expected by the user." |
| **可移植性 (Portability)** | **Portability** |
| 软件能在不同硬件/操作系统环境下运行 (如 Windows $\rightarrow$ Unix)。需减少对平台特有功能的依赖。 | The ability to run in different hardware/OS environments. Requires reducing dependence on platform-specific features. |
| **可维护性 (Maintainability)** | **Maintainability** |
| 软件修改和维护的容易程度。包含：**修正性维护** (修复缺陷) 和 **适应性维护** (适应新环境/需求)。 | The ease of modification and maintenance. Includes: **Corrective maintenance** (fixing defects) and **Adaptive maintenance** (adapting to new environments/requirements). |
| **可复用性 (Reusability)** | **Reusability** |
| 软件组件能否方便复用到其他系统。依赖于通用性、参数化和可配置性。 | The ease of reusing software components in other systems. Depends on generality, parameterization, and configurability. |
| **互操作性 (Interoperability)** | **Interoperability** |
| 系统能否方便与其他系统协同工作。依赖于接口标准化、遵守编码规范。 | The ease with which the system can cooperate with other systems. Depends on interface standardization and adherence to coding standards. |

---

### 2. 设计目标中的质量属性 (Quality Attributes – Design Objectives)

| 中文 (Chinese) | 英文 (English) |
| :--- | :--- |
| **模块化 (Modularity)** | **Modularity** |
| 系统由可替换、独立的小模块组成，有助于开发与后期维护。 | The system is composed of replaceable, independent small modules, aiding development and maintenance. |
| **可移植性 (Portability)** | **Portability** |
| 能在不同环境之间直接迁移。 | The ability to migrate directly between different environments. |
| **灵活性 / 可修改性 (Flexibility / Modifiability)** | **Flexibility / Modifiability** |
| 能适应用户需求和问题场景的变化。 | The ability to adapt to changes in user requirements and problem scenarios. |
| **概念完整性 (Conceptual Integrity)** | **Conceptual Integrity** |
| 设计需和谐、对称、可预测，保持整体一致性。 | The design should be harmonious, symmetrical, and predictable, maintaining overall consistency. |
| **良好结构 (Well-Structured)** | **Well-Structured** |
| 遵循信息隐藏等原则组织设计结构。 | Organizing the design structure according to principles like information hiding. |
| **简洁性 (Simple)** | **Simple** |
| 避免过度设计，遵循“尽可能简单，但不更简单”的原则。 | Avoiding over-design, following the principle of "as simple as possible, but no simpler." |
| **高效性 (Efficient)** | **Efficient** |
| 功能应能在有限资源下计算实现。 | Functionality should be computationally achievable with limited resources. |
| **充分性 (Adequate)** | **Adequate** |
| 能满足明确的需求。 | Capable of meeting explicit requirements. |
| **可实现性 (Implementable)** | **Implementable** |
| 功能必须在现有技术下能落地。 | Functionality must be realizable with existing technology. |
| **标准化 (Standardised)** | **Standardized** |
| 文档和设计符号应使用行业标准或通用标记法。 | Documentation and design notations should use industry standards or common markup. |
| **可行性 (Feasibility)** | **Feasibility** |
| 实现过程必须能被实际执行。 | The implementation process must be practically executable. |
| **开发过程的可靠性 (Reliability of Development)** | **Reliability of Development** |
| 开发过程本身要尽可能保证成功率。 | The development process itself should maximize the probability of success. |

---

### 3. 软件设计原则 (Software Design Principles)

| 中文 (Chinese) | 英文 (English) |
| :--- | :--- |
| **考虑替代方案** | Always consider different solution alternatives. |
| **追溯性** | The design should be traceable to the analysis model. |
| **利用现有方案** | Leverage existing solutions; don't reinvent the wheel. |
| **贴近问题** | The design should closely align with the real-world problem. |
| **一致性与集成性** | The design needs to show consistency and integration (uniformity, clear interface definitions). |
| **反复评审** | The design requires repeated review to minimize conceptual errors. |
| **设计编码** | Design is at a higher level of abstraction than coding, even in detail design. |
| **支持变更** | The design should accommodate change. |
| **创建时评估质量** | Quality should be assessed as the design is created. |

---

### 4. 设计中的基本概念 (Concepts in Design)

| 中文 (Chinese) | 英文 (English) |
| :--- | :--- |
| **抽象 (Abstraction)** | **Abstraction** |
| 聚焦高层问题，屏蔽不必要的细节。 | Focusing on high-level concerns, hiding unnecessary details. |
| **模块化 (Modularity)** | **Modularity** |
| 拆分成可独立命名、寻址的组件，组合满足系统需求。 | Decomposition into independently nameable and addressable components that combine to satisfy system requirements. |
| **逐步求精 (Refinement)** | **Refinement** (Stepwise Refinement) |
| 自顶向下设计，逐层细化细节，每一步都包含设计决策。 | Top-down design, progressively elaborating details layer by layer, with each step involving design decisions. |
| **模块化设计的优势 (Advantages of Modular Design)** | **Advantages of Modular Design** |
| 管理容易、理解简单、降低复杂度、支持分工、容错性好、支持独立开发、关注点分离、增强复用。 | Easier management, simpler understanding, reduced complexity, supports division of labor, good fault isolation, supports independent development, separation of concerns, enhanced reusability. |

---

### 5. 有效的模块化设计 (Effective Modular Design)
#### Modular Design
- Easier to manage
- Easier to understand
- Reduces complexity
- Delegation / division of work
- Fault isolation
- Independent development
- Separation of concerns
- Reuse

| 中文 (Chinese) | 英文 (English) |
| :--- | :--- |
| **信息隐藏 (Information Hiding)** | **Information Hiding** |
| 模块内部数据与过程对无关模块不可见，减少修改影响，降低耦合。 | A module's internal data and procedures are invisible to irrelevant modules, minimizing modification impact and reducing coupling. |
| **内聚性 (Cohesion)** | **Cohesion** |
| 模块应“只做一件事”，高内聚模块更易复用、理解、维护。 | A module should "do one thing only"; highly cohesive modules are easier to reuse, understand, and maintain. |
| **耦合性 (Coupling)** | **Coupling** |
| 模块间依赖关系的强度。高耦合导致连锁修改、难以复用。 | The strength of the dependency relationship between modules. High coupling leads to ripple effects from changes and difficulty in reuse. |
| **功能独立性 (Functional Independence)** | **Functional Independence** |
| **高内聚 + 低耦合** 是功能独立的标志。好处：错误隔离、可复用性、可理解性强。 | The hallmark of functional independence is **High Cohesion + Low Coupling**. Benefits: Error isolation, reusability, strong understandability. |

---

### 总结 (Summary)

这份笔记的核心在于理解软件设计的**质量属性**：从宏观上确定**好的设计**具备的特性 (效率、可靠性等)，再将其细化为**设计目标** (模块化、简洁性)，最后通过**设计原则**和**基本概念** (抽象、信息隐藏、内聚、耦合) 指导如何构建**高质量**的软件架构。

---