import { LineAwesomeIcon } from "../../interfaces/lineAwesome";

export default abstract class BaseWidget {

	/** Widget unique id */
	public abstract readonly id: string;

	/** Widget Name */
	public abstract readonly name: string;

	/** Widget description */
	public abstract readonly description: string;

	/** Widget icon */
	public abstract readonly icon?: LineAwesomeIcon | string;

	/** For group access rights by department */
	public abstract readonly department: string;

	/** Widget size */
	public abstract readonly size: {
		h: number
		w: number
	} | null;

	public abstract readonly widgetType:
		/** An informational widget type that only shows the state */
		"info" |
		/** Binary state switching */
		"switcher" |
		/** Run task */
		"action" |
		/** Change location, or open in new tab */
		"link" |

		"custom"
	;
}
