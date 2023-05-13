export default abstract class BaseWidget {
    /** Widget unique ID */
    abstract readonly ID: string;
    /** Widget Name */
    abstract readonly name: string;
    /** Widget decription */
    abstract readonly description: string;
    /** Widget icon */
    abstract readonly icon: string;
    /** For group access rights by department */
    abstract readonly department: string;
    abstract readonly widgetType: 
    /** An informational widget type that only shows the state */
    "info" | 
    /** Binary state switching */
    "switcher" | 
    /** Run task */
    "task" | 
    /** Change location, or open in new tab */
    "link" | "custom";
}
