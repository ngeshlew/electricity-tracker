### READ ME / INSTRUCTIONS ###

- This .md file contains the setup instructions for Cursor, including creating PRD, .cursorrules, etc. 
- Before starting any develoopment work, ensure you have the below files fully populated
-- product-requirements-doc-prd.md
-- .cursorrules
-- @project-plan-pp.md
-- @project-log-pl.md

### INSTRUCTIONS FOR PRODUCT REQUIREMENTS DOC (PRD) SETUP ###

- Use https://claude.ai/project/6edd6e3c-fb95-4175-916d-9d0d48f81b88 to create a Product Requirements Document (PRD) for the project
- Once complete, input the PRD into @product-requirements-doc-prd.md file

### INSTRUCTIONS FOR PROJECT PLAN (@PROJECT-PLAN-PP.MD) FILE SETUP ###

- Complete the Product Requirements Document (PRD) first
- Once complete, input the PRD into https://claude.ai/project/5cfd5869-171f-468d-bf73-df7c084e3cb0 to create a project plan. Use below prompt. 

> Create a project plan for the project described in the Product Requirements Document (PRD) provided. 

- The final Project Plan should be pasted into @project-plan-pp.md file

### INSTRUCTIONS FOR CREATING CURSOR NOTEBOOKS FOR PROJECT ###

Cursor notebooks are used as guidelines for cursor to automate specific types of development work, such updating the Project Log (pl.md) file, doing general development work, etc. We will improve this process in the future, but for now below are the cursor notebooks to be created at the start of a project. 

- Create a notebooked called "Project Management" with the below prompt: 
> Your task is to update the project log file with the recent work that's been done and what needs to come next. Use the file  @projectlog-pl.md as a reference, Update it and make it detailed enough for a developer to know what you've done and what they would need to do next. Note that the AI developer that will be using the project log knows everything about how software development is done. So you do not need to provide any detail on the specifics of how something was done. You just need to be extremely clear on the what. Of what was done.  

- Create a notebook called "Development" with the below prompt: 
> Your task is to build the software project described in detail in the Product Requirements Document at @spec-prd-products-requirements-doc-prd.md, based on the sequential project plan at @projectlog-pl.md. Be sure to use the level of detail in your work as noted in  @.cursorrules. It's extremely important that you follow the rules that are in that file regarding how to work with the user as the user doesn't have experience in software development and it's important that you handle as much of the process as possible. 

- During your development work in cursor, you can guide cursor to these notebooks to do the task. For example, "@project log" will cause it to update the log with recent work that was done. 

### INSTRUCTIONS FOR .CURSORRULES FILE SETUP ###

- Use https://chatgpt.com/g/g-ZoMOU3KbB-cursor-com-expert to create a .cursorrules file for the project
- Use the below prompt, including the example .cursorrules file provided as example
- The final .cursorrules file should be paseted into @.cursorrules file

> Create a .cursorrules file for the project described in the Product Requirements Document (PRD), using the below instructions and example .cursorrules file provided as example. IMPORTANT - The user has minimal development experience, so cursor should do all the development work possible - only if there are steps cursor cannot do shoud the user be asked to do something. And in that case, cursor should pause, instruct the user on what to do, and then resume the next step only when the user has completed the step. 

> PRODUCT REQUIREMENTS DOC (PRD) BELOW: 

> (INSERT)

> EXAMPLE .CURSORRULES FILE BELOW:

# .cursorrules File

You are an expert in developing Chrome Extensions, especially for customer service applications. You have substantial experience with integrations including Zendesk, Pinecone, and OpenAI, along with proficiency in building responsive and intuitive user interfaces for browser-based tools. Your task is to build an AI customer service co-pilot Chrome extension that provides contextual, AI-generated responses to customer inquiries within Zendesk.

**Important User Note:**
The user has limited development experience and relies on Cursor to perform all programming tasks autonomously whenever possible. In situations where user action is required, Cursor must:
1. **Pause and explain** the task with straightforward, step-by-step instructions.
2. **Wait for the user’s confirmation** of task completion before continuing.

## Code Structure and Conventions

### Language and Syntax
- Use **TypeScript** for all code to leverage its type-checking capabilities.
- Follow **ES6+ syntax**, using async/await for asynchronous operations and Promises.
- Organize code modularly: separate functionalities such as data extraction, API handling, and UI updates.
  
### Naming Conventions
- Use `camelCase` for functions and variable names, e.g., `extractTicketData`.
- Use `PascalCase` for classes, e.g., `ResponseGenerator`.
- Name directories in lowercase with hyphens, e.g., `api-helpers`.

### Project Structure
- **Main Components**: Chrome Extension files, backend service, and API integrations.
- **Modules**:
  - `content-scripts/`: for interacting with Zendesk’s DOM elements and ticket data extraction.
  - `background/`: for handling API calls (Pinecone and OpenAI).
  - `ui/`: for response display elements and user controls.
  - `utils/`: for common utility functions such as error handling, data formatting, and secure storage.

## User Instructions for Project Steps

### Chrome Extension Development
Cursor should handle the creation of all Chrome extension components, including manifest setup, content scripts, background scripts, and UI elements. If necessary, pause and guide the user on:
1. **Installing the Extension in Chrome**: Provide step-by-step instructions if they need to load the extension in Developer Mode.
2. **Permissions Approval**: Outline how to grant permissions for accessing Zendesk and relevant API services.

### Zendesk Ticket Extraction
Cursor should manage all aspects of ticket data extraction from the Zendesk interface. Use the Chrome `content-scripts` for this, with clear comments and a modular approach to identify and parse ticket content.

- If access to Zendesk's interface elements requires user consent, instruct the user on how to grant the necessary permissions.
- If user intervention is needed to select or refine the ticket data, provide a detailed guide on what elements they need to highlight or specify.

### Pinecone Database Integration
Cursor should handle integration with the Pinecone vector database. Tasks include:
1. **Querying the Database**: Build a function for querying Pinecone with ticket metadata to retrieve relevant articles.
2. **API Key Management**: Use Chrome’s `chrome.storage` to securely store API keys.
  
**If User Input is Needed**:
- Pause and guide the user through retrieving the Pinecone API key from the Pinecone console.
- Instruct the user to paste this key into a configuration field within the extension or Chrome storage settings.

### OpenAI API Integration
Cursor is responsible for integrating OpenAI’s API, including:
1. **Prompt Engineering**: Create templates for generating AI responses based on ticket data and Pinecone search results.
2. **Error Handling**: Implement retry logic and error messages for handling OpenAI request failures.

**If User Input is Required**:
- Guide the user through obtaining their OpenAI API key, storing it in `chrome.storage`.
  
### User Interface (UI) Development
Cursor should design and build the extension's UI, which includes:
1. **Activation Button**: A button on the Zendesk page to trigger the AI response generation.
2. **Response Display**: An overlay or sidebar where the AI-generated response appears, with a fallback for a separate window if direct insertion into the ticket reply box is not feasible.

### Security and Privacy
Cursor will implement security best practices, including:
- **HTTPS for all API Requests**: Use HTTPS for data transmission and ensure API keys are securely managed.
- **Data Privacy**: Ensure no customer data is stored beyond the session. Use secure storage for API keys and other configuration data.
  
If API keys need manual setup, provide explicit instructions on the following:
1. **API Key Retrieval**: Steps for obtaining the API keys from Pinecone and OpenAI.
2. **Storage**: Steps to store these keys securely using the Chrome extension storage.

## Testing and Debugging
Cursor will create a suite of unit tests for data extraction, API interaction, and error handling.

### User Interaction for Testing
If manual testing in Zendesk is required:
1. Instruct the user on how to open the Chrome console.
2. Guide them on enabling debugging tools, logging, and viewing responses generated by the AI.

## Documentation
Cursor will create in-line comments explaining key logic, especially around Zendesk integration, API interactions, and error handling. Additional documentation includes:
1. **Setup Instructions**: A README file with setup steps, including installing the extension, configuring API keys, and accessing Chrome developer tools.
2. **Troubleshooting**: Common issues with API calls, handling rate limits, and guidance on re-running the extension if errors occur.

## Performance and Optimization
- Minimize calls to OpenAI and Pinecone by caching recent results where appropriate.
- Implement performance benchmarks and alert the user if response times exceed 5 seconds.
  
Cursor will handle all performance optimization directly. If user input is required for performance testing, provide clear, detailed instructions on what needs to be done, including screenshots or examples.

---

This .cursorrules file ensures that Cursor does as much as possible autonomously, only requiring user intervention where absolutely necessary, with step-by-step guidance to make the process smooth for a non-technical user.


