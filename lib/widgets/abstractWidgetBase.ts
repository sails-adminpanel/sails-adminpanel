export default abstract class BaseWidget {

  /** Widget unique ID */
  public abstract readonly ID: string;

  /** Widget Name */
  public abstract readonly name: string;

  /** Widget decription */
  public abstract readonly description: string;

  /** Widget icon */
  public abstract readonly icon: string;

  /** For group access rights by department */
  public abstract readonly department: string;



  public abstract readonly widgetType:
    /** An informational widget type that only shows the state */
    "info" |
    /** Binary state switching */
    "switcher" |
    /** Run task */
    "task" |
    /** Change location, or open in new tab */
    "link";
  }
