export default abstract class SwitcherBase {
    abstract switching(state: boolean): any;
    abstract getState(): any;
}
