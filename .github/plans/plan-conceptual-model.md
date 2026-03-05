# PRD — GTD Conceptual Model

1. ## Product Vision
    
    The application will digitally implement the Getting Things Done method, created by David Allen, whose goal is to allow users to:
    
    - Capture everything that draws their attention;
    - Process this information in a structured way;
    - Organize actions and outcomes;
    - Review their system regularly;
    - Execute tasks with clarity.

    The system aims to reduce cognitive load, allowing users to trust the system to store commitments, ideas, and responsibilities.

2. ## System Objectives

    The system must allow users to:

    - Capture any type of input;
    - Transform inputs into actionable items;
    - Organize actions and outcomes;
    - Continuously review the system;
    - Select actions for execution.

    The product should not impose its own methodology, but rather operationalize the GTD workflow.

3. ## Core Principles

    The system must respect the central principles of GTD.

    - ### Mind Externalization
    
        The user should not rely on memory to remember tasks or commitments. Everything must be capturable in the system.

    - ### Clarity of the Next Action
        
        Every actionable item must result in a visible and physical next action, for example:

        - ❌ "Organize trip";
        - ✔ "Search for flights to Lisbon".

    - ### Outcomes Require Multiple Actions
    
        Any outcome that requires more than one action is considered a Project.

    - ### Separation Between Processing and Execution

        The system clearly distinguishes between:

        - capturing;
        - processing;
        - executing.

        Mixing these stages leads to loss of focus.

    - ### Trust in the System
    
        The user must trust that:
        
        - everything relevant is in the system;
        - nothing will be lost;
        - the system is reviewed regularly.

4. ## Operational Workflow of the Method

    The system must implement the fundamental GTD workflow.

    1. ### Capture Stage

        Anything that draws the user's attention should be recorded, for example:

        - task;
        - idea;
        - reminder;
        - commitment;
        - information.

        These items enter an **unprocessed state**.

        #### Properties of a captured item:
        
        - it has not yet been interpreted;
        - it has no category;
        - it has no defined action.

        This state represents the **Inbox**.

    2. ### Clarification Stage

        Each captured item must be analyzed to determine:

        - what it means;
        - whether it requires action;
        - what the next action is.

        #### Central question:

        > "Does this require any action?"

        1. #### Non-Actionable Case

            The item may become:

            - Reference: Useful information for future consultation;
            - Incubation: Ideas or possibilities for the future;
            - Discarded: Items with no utility.

        2. #### Actionable Case

            If the item requires action, the user must define:

            - what the next physical action is;
            - whether the outcome requires multiple actions.

        3. #### Two-Minute Rule

            If the action can be completed in less than two minutes, it is recommended to do it immediately.
            
            The system may record this decision but must not force the user to do so.

    3. ### Organization Stage

        Clarified items must be organized into structural categories.
        
        These categories represent **organizational states**, not priorities.

        - #### Actions

            An action is an executable physical task.

            #### Characteristics:

            - executable within a specific context;
            - independent of complex planning.

        - #### Projects    

            A project represents a desired outcome that requires more than one action. Every project must have at least one next action.

        - #### Waiting For

            Items delegated or dependent on third parties.

        - #### Incubation

            Items that do not require action at the moment but may become relevant in the future.

        - #### Reference

            Information that does not require action but should be preserved.

5. ## Contexts

    Actions may be associated with contexts, which represent conditions necessary for execution.

    Examples:

    - computer;
    - phone;
    - home;
    - office;
    - street.

    The goal is to allow users to select tasks appropriate to the environment they are currently in.

6. ## System Review

    The system must allow periodic reviews, but should not restrict them to fixed intervals. Users can review the system at any time.

    During a review, users may:

    - process pending items;
    - check active projects;
    - review items that are waiting for responses;
    - reconsider incubated items.

    ### Review Records

    Each review must be recorded for the purposes of:

    - history;
    - personal auditing;
    - usage metrics.

    A review record may contain:

    - date and time;
    - items analyzed;
    - projects reviewed;
    - actions completed or created.

7. ## Execution

    The system must allow users to select actions based on:

    - available context;
    - available time;
    - mental energy;
    - personal priority.

    The GTD method does not impose strict priority ordering.
    
    The user decides the best action to execute considering their current reality.

8. ## Conceptual States of the System

    Items may exist in different conceptual states:

    - ### Captured
        Item not yet processed.

    - ### Clarified
        Item already interpreted.

    - ### Organized
        Item associated with a structure in the system.

    - ### Executable
        Action ready to be executed.

    - ### Completed
        Action finished.

9. ## Conceptual Entities of the Method

    The system must support the following conceptual entities.

    - ### Captured Item
        Represents any initial input from the user.

    - ### Action
        Basic unit of execution.

    - ### Project
        An outcome that requires multiple actions.

    - ### Context
        Environment required to execute actions.

    - ### Review Record
        History of system reviews performed by the user.

10. ## Fundamental Rules of the Method

    The system must guarantee some essential GTD rules.
    
    - Every project must have at least one next action;
    - Items in the inbox should not remain unprocessed indefinitely;
    - Actions must represent concrete physical activities;
    - Reviews must allow maintenance of system integrity;
    - Reference information must not be confused with tasks.

11. ## Non-Objectives

    This PRD does not define:

    - user interface;
    - technical architecture;
    - database model;
    - external integrations.

    These aspects will be defined in specific PRDs.