# Install Stepper Documentation

## Overview

The `InstallStepper` class provides functionality to manage and process installation steps. It is designed to guide users through a series of steps required to set up an application. Each step is represented by a class that extends `InstallStepAbstract`.

## InstallStepAbstract

The `InstallStepAbstract` class serves as a template for individual installation steps. Each step must extend this abstract class and implement the required methods and properties.

### Properties of abstract class

- `id` (string): Unique identifier for the installation step.
- `title` (string): Display name of the installation step.
- `sortOrder` (number): Order in which the step should be presented to the user.
- `canBeSkipped` (boolean): Indicates whether the step can be skipped by the user.
- `description` (string): Brief description of the installation step.
- `scriptsUrl` (string): URL to additional JavaScript scripts required for the step.
- `stylesUrl` (string): URL to additional CSS stylesheets required for the step.
- `ejsPath` (string): File path to the EJS (Embedded JavaScript) template used for rendering the step.

### Instance Variables

- `isSkipped` (boolean): Indicates whether the step has been skipped.
- `isProcessed` (boolean): Indicates whether the step has been processed.
- `payload` (any): Data that will be provided to the browser during the step.


### Methods

- `process(data: any): Promise<void>`: Action to be executed when saving data to storage during the step.
- `skipIt(): Promise<void>`: Initiates the skipping process for the step. Throws an error if the step cannot be skipped. Calls skip() method.
- `skip(): Promise<void>`: Action to be executed when skipping the step. Protected method that will be executed from skipIt() method after all required checks.
- `check(): Promise<boolean>`: Checks whether the step should be processed during installation. If returns true, step will not be added to stepper

## InstallStepper Class

The `InstallStepper` class manages the overall installation process and provides methods for processing steps, skipping steps, adding steps, and checking the status of unprocessed steps.

### Static Methods

- `getSteps(): InstallStepAbstract[]`: Retrieves the array of registered installation steps.
- `processStep(stepId: string, data: any): Promise<void>`: Processes the specified installation step with the provided data.
- `render(): RenderData`: Prepares the steps array for rendering in the user interface.
- `skipStep(stepId: string): Promise<void>`: Initiates the skipping process for the specified step.
- `addStep(step: InstallStepAbstract)`: Adds a new installation step, replacing it if it already exists.
- `hasUnprocessedSteps(): boolean`: Checks if there are unprocessed steps remaining in the installation process.

### RenderData Interface

- `totalStepCount` (number): Total number of steps in the installation process.
- `processedStepCount` (number): Number of steps that have been processed.
- `leftSteps` (InstallStepAbstract[]): Array of remaining steps to be processed.

## Usage

1. **Defining Installation Steps:**
    - Create a class that extends `InstallStepAbstract`.
    - Implement the required properties and methods.

2. **Adding Installation Steps:**
    - Use the `addStep` method of the `InstallStepper` class to add new steps.

3. **Processing Steps:**
    - Use the `processStep` method to process a specific step with the required data.

4. **Skipping Steps:**
    - Use the `skipStep` method to initiate the skipping process for a specific step.

5. **Rendering Steps for User Interface:**
    - Utilize the `render` method to prepare the steps array for rendering in the user interface.

6. **Checking Unprocessed Steps:**
    - Use the `hasUnprocessedSteps` method to check if there are any unprocessed steps remaining.

## Example

```javascript
// Define a new installation step
class SampleInstallStep extends InstallStepAbstract {
    // Implementation of properties and methods
}

// Add the new step to the InstallStepper
InstallStepper.addStep(new SampleInstallStep());

// Process the steps
await InstallStepper.processStep('sampleStepId', { /* data */ });

// Render steps for UI
const renderData = InstallStepper.render();
console.log(renderData);
```

## Important Notes

- Ensure that installation steps are added in the desired order using the `sortOrder` property.
- Make sure to implement the required methods and properties when creating custom installation steps.
