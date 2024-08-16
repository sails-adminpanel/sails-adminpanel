class PopUp {
	/** PopUp Div id */
	public id: string

	public contentId: string | undefined
	public modal: any
	public content: any
	protected eventHandlers: any = {}
	public isClosing: boolean = false

	constructor() {

		// PopUp behavior router
		this.contentId = `content-${this.guidGenerator()}`;
		this.id = `popup-${this.guidGenerator()}`
		this.open();
	}


	protected open(): void {
		this.modal = document.createElement("div");
		this.modal.id = this.id
		this.modal.className = 'admin-modal-pu'
		this.modal.insertAdjacentHTML('afterbegin', `
        <div class="admin-modal-pu-wrapper">
            <div class="close-admin-modal-pu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg></div>
            <div id="content-${this.id}" style="height: 100%">
        </div>
        `)

		document.body.appendChild(this.modal)

		if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
			setTimeout(() => {
				this.modal.classList.add('admin-modal-pu--active')
			}, 100)
		} else {
			setTimeout(() => {
				this.modal.classList.add('admin-modal-pu--active')
			})
		}

		this.content = document.getElementById(`content-${this.id}`);

		const closeModalBtn = this.modal.querySelector('.close-admin-modal-pu')

		closeModalBtn.addEventListener('click', () => {
			this.closeModal()
		})

		setTimeout(() => {
			this.trigger('open')
		})
	}

	public closeModal(): void {
		this.modal.classList.remove('admin-modal-pu--active')
		setTimeout(() => {
			this.modal.remove()
			this.trigger('close')
		}, 300)
	}


	public on(event: string, callback: () => void) {
		if (!(event in this.eventHandlers)) {
			this.eventHandlers[event] = [];
		}

		for (let i = 0; i < this.eventHandlers[event]; i++) {
			if (this.eventHandlers[event][i] === callback) {
				return;
			}
		}

		this.eventHandlers[event].push(callback);
	}

	public trigger(event: string, eventParams = {}) {
		if (!(event in this.eventHandlers)) {
			return;
		}

		this.eventHandlers[event].forEach((handler: (arg0: {}) => any) => handler(eventParams));
	}

	protected guidGenerator(): string {
		const S4 = function () {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}
}

export class AdminPopUp {
	public static popups: PopUp[] = []

	static new() {
		//console.log(this.popups)
		if (this.popups.length) {
			let prevModal = document.getElementById(this.popups[this.popups.length - 1].id);
			this.offsetToggle(prevModal)
		}

		let popup = new PopUp();

		// close Pop-up on click outside Pop-up
		popup.modal.addEventListener('click', (e: any) => {
			if (!e.composedPath().includes(popup.modal.querySelector('.admin-modal-pu-wrapper')) && !popup.isClosing) {
				popup.closeModal()
			}
		})

		this.popups.push(popup);

		// Handle close event
		popup.on('close', () => {
			popup.isClosing = true
			this.popups.pop();
			if (this.popups.length) {
				let prevModal = document.getElementById(this.popups[this.popups.length - 1].id);
				this.offsetToggle(prevModal)
			}
			setTimeout(() => {
				popup.isClosing = false
			}, 300)
		})
		return popup;
	}

	public static closeAll() {
		for (const popup of this.popups) {
			popup.closeModal()
		}
	}

	private static offsetToggle(prevModal: HTMLElement | null) {
		if (prevModal !== null) {
			let prevModalwrapper = prevModal.querySelector('.admin-modal-pu-wrapper')
			if (prevModalwrapper !== null) prevModalwrapper.classList.toggle('admin-modal-pu-offset')
		}
	}
}

(window as any).AdminPopUp = AdminPopUp
