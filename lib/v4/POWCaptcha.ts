let CryptoPuzzle = require("fix-esm").require("crypto-puzzle").default; // https://github.com/fabiospampinato/crypto-puzzle/issues/2
import { v4 as uuid } from "uuid";

export class POWCaptcha {
  private static taskStorage: TaskStorage = {};
  private static taskQueue: string[] = [];
  private static readonly MAX_TASKS = 50000;

  public async getJob(label: string): Promise<number[]> {
    const id = uuid();

    if (!label) throw new Error(`Label not provided`);

    let difficultyDuration = Number(process.env.CAPTCHA_POW_DIFFICULTY) || 3000; // Default: 3 seconds
    let attempt = 0;

    // Cleanup old tasks and count attempts
    Object.keys(POWCaptcha.taskStorage).forEach((key) => {
      const task = POWCaptcha.taskStorage[key];
      if (task.time < Date.now() - 30 * 60 * 1000) {
        this.deleteTask(key); // Remove expired tasks
      } else if (task.label === label) {
        attempt++;
      }
    });

    // Increase difficulty based on number of attempts
    const difficultyCoefficient = 1 + Math.floor(attempt / 7);
    difficultyDuration *= difficultyCoefficient;

    // Generate the puzzle
    const puzzleOptions = {
      duration: difficultyDuration, // Adjust duration in milliseconds
      message: `${id}:${label}`,
    };

    const puzzle = await CryptoPuzzle.generate(puzzleOptions);
    const task: number[] = Array.from(puzzle); // storing as number of bytes

    // Store the task in memory
    POWCaptcha.taskStorage[id] = {
      time: Date.now(),
      label: label,
      puzzle: puzzle, // Original Uint8Array puzzle
    };

    // Add to queue and enforce limit
    POWCaptcha.taskQueue.push(id);
    if (POWCaptcha.taskQueue.length > POWCaptcha.MAX_TASKS) {
      const oldestTaskId = POWCaptcha.taskQueue.shift();
      if (oldestTaskId) this.deleteTask(oldestTaskId);
    }

    return task;
  }

  public check(captchaSolution: string, label: string): boolean {
    let taskId = captchaSolution.split(":")[0];
    if (!taskId) {
      return false;
    }

    const task = POWCaptcha.taskStorage[taskId];
    if (!task || task.label !== label) return false;

    // Verify the solution (should be equal to puzzleOptions.message)
    console.log("QUESTION", `${taskId}:${label}`)
    if (`${taskId}:${label}` === captchaSolution) {
      this.deleteTask(taskId);
      return true;
    }

    return false;
  }

  private deleteTask(id: string): void {
    delete POWCaptcha.taskStorage[id];
  }
}

export type TaskStorage = {
  [key: string]: {
    /** Identifies the action for which it was resolved */
    label: string;
    time: number;
    puzzle: Uint8Array;
  };
};
