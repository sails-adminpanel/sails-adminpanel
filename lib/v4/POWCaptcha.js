"use strict";
// TODO переписываем под 5-ю версию крипто пазла и используем в логине (на get). Солвить пазл на фронте и возвращаться на пост логина для проверки
// TODO captcha solver прокинуть в gulp, передать на фронт и там вызвать чтобы решить каптчу и вернуть на контроллер (подложить в скрытое поле перед отправкой)
Object.defineProperty(exports, "__esModule", { value: true });
exports.POWCaptcha = void 0;
let Puzzle = require("fix-esm").require("crypto-puzzle").default; // https://github.com/fabiospampinato/crypto-puzzle/issues/2
const uuid_1 = require("uuid");
class POWCaptcha {
    async getJob(label) {
        const id = (0, uuid_1.v4)();
        /**
         * Action: as example captcha adapter receive label `login:12025550184` sent task, and a client solves it
         * When a client pass solved captcha to login user, Method User.login pass same label, and if this not matched
         * Captcha adapter reject login.
         * To prevent brute force, the adapter increases the complexity after several attempts.
         */
        if (!label)
            throw new Error(`label not provided`);
        let difficulty = Number(process.env.CAPTCHA_POW_DIFFICUTLY) ? Number(process.env.CAPTCHA_POW_DIFFICUTLY) : 7 * 1000;
        let attempt = 0;
        // Deleting old tasks and counting attempts
        Object.keys(POWCaptcha.taskStorage).forEach((item) => {
            const task = POWCaptcha.taskStorage[item];
            if (task.time < Date.now() - 30 * 60 * 1000) {
                this.deleteTask(item);
            }
            else if (task.label === label) {
                attempt++;
            }
        });
        // Increasing difficulty based on attempts quantity
        const difficultyCoefficient = 1 + Math.floor(attempt / 7);
        difficulty *= difficultyCoefficient;
        const puzzle = await Puzzle.generate(difficulty);
        const task = {
            id: id,
            task: JSON.stringify(puzzle.question, (key, value) => typeof value === "bigint" ? value.toString() + "n" : value),
        };
        // Saving task to storage
        POWCaptcha.taskStorage[id] = {
            task: task,
            time: Date.now(),
            label: label,
            puzzle: puzzle,
        };
        // Adding to queue and controlling the limit
        POWCaptcha.taskQueue.push(id);
        if (POWCaptcha.taskQueue.length > 50) {
            const oldestTaskId = POWCaptcha.taskQueue.shift();
            if (oldestTaskId)
                this.deleteTask(oldestTaskId);
        }
        return task;
    }
    async check(resolvedCaptcha, label) {
        const task = POWCaptcha.taskStorage[resolvedCaptcha.id];
        if (!task || task.label !== label)
            return false;
        const puzzle = task.puzzle;
        if (puzzle.solution === BigInt(resolvedCaptcha.solution)) {
            this.deleteTask(resolvedCaptcha.id);
            return true;
        }
        return false;
    }
    deleteTask(id) {
        delete POWCaptcha.taskStorage[id];
    }
}
exports.POWCaptcha = POWCaptcha;
POWCaptcha.taskStorage = {};
POWCaptcha.taskQueue = [];
