"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPopUp = void 0;
let stylesheet = document.createElement("style");
stylesheet.innerText = '.admin-modal-pu{z-index:99999;position:fixed;width:100vw;height:100vh;top:0;left:0;background-color:rgba(0,0,0,.62);opacity:0;visibility:hidden;transition:all .3s ease-in-out}.admin-modal-pu--active{opacity:1;visibility:visible}.admin-modal-pu-wrapper{position:absolute;top:0;left:120%;width:80%;height:100vh;background-color:#f0f8ff;transition:all .3s ease-in-out}.admin-modal-pu--active .admin-modal-pu-wrapper{left:20%}.admin-modal-pu--active .admin-modal-pu-wrapper.admin-modal-pu-offset{left:0;width:100%}.close-admin-modal-pu{cursor:pointer;position:absolute;top:15px;right:15px}.close-admin-modal-pu:hover svg path{fill:red}@media(max-width:768px){.admin-modal-pu-wrapper{left:100%;width:100%}.admin-modal-pu--active .admin-modal-pu-wrapper{left:0}}';
document.head.appendChild(stylesheet);
class PopUp {
    constructor() {
        this.eventHandlers = {};
        this.isClosing = false;
        // PopUp behavior router
        this.contentId = `content-${this.guidGenerator()}`;
        this.id = `popup-${this.guidGenerator()}`;
        this.open();
    }
    open() {
        this.modal = document.createElement("div");
        this.modal.id = this.id;
        this.modal.className = 'admin-modal-pu';
        this.modal.insertAdjacentHTML('afterbegin', `
        <div class="admin-modal-pu-wrapper">
            <div class="close-admin-modal-pu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg></div>
            <div id="content-${this.id}">
        </div>
        `);
        document.body.appendChild(this.modal);
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            setTimeout(() => {
                this.modal.classList.add('admin-modal-pu--active');
            }, 100);
        }
        else {
            setTimeout(() => {
                this.modal.classList.add('admin-modal-pu--active');
            });
        }
        this.content = document.getElementById(`content-${this.id}`);
        const closeModalBtn = this.modal.querySelector('.close-admin-modal-pu');
        closeModalBtn.addEventListener('click', () => {
            this.closeModal();
        });
        setTimeout(() => {
            this.trigger('open');
        });
    }
    closeModal() {
        this.modal.classList.remove('admin-modal-pu--active');
        setTimeout(() => {
            this.modal.remove();
            this.trigger('close');
        }, 300);
    }
    on(event, callback) {
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
    trigger(event, eventParams = {}) {
        if (!(event in this.eventHandlers)) {
            return;
        }
        this.eventHandlers[event].forEach((handler) => handler(eventParams));
    }
    guidGenerator() {
        const S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}
class AdminPopUp {
    static new() {
        //console.log(this.popups)
        if (this.popups.length) {
            let prevModal = document.getElementById(this.popups[this.popups.length - 1].id);
            this.offsetToggle(prevModal);
        }
        let popup = new PopUp();
        // close Pop-up on click outside Pop-up
        popup.modal.addEventListener('click', (e) => {
            if (!e.composedPath().includes(popup.modal.querySelector('.admin-modal-pu-wrapper')) && !popup.isClosing) {
                popup.closeModal();
            }
        });
        this.popups.push(popup);
        // Handle close event
        popup.on('close', () => {
            popup.isClosing = true;
            this.popups.pop();
            if (this.popups.length) {
                let prevModal = document.getElementById(this.popups[this.popups.length - 1].id);
                this.offsetToggle(prevModal);
            }
            setTimeout(() => {
                popup.isClosing = false;
            }, 300);
        });
        return popup;
    }
    static closeAll() {
        for (const popup of this.popups) {
            popup.closeModal();
        }
    }
    static offsetToggle(prevModal) {
        if (prevModal !== null) {
            let prevModalwrapper = prevModal.querySelector('.admin-modal-pu-wrapper');
            if (prevModalwrapper !== null)
                prevModalwrapper.classList.toggle('admin-modal-pu-offset');
        }
    }
}
exports.AdminPopUp = AdminPopUp;
AdminPopUp.popups = [];
window.AdminPopUp = AdminPopUp;
